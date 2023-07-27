import {
    LogAccrue,
    LogBorrow,
    LogAddCollateral,
    LogRemoveCollateral,
    LogRepay,
    LogExchangeRate,
    LiquidateCall,
    Cauldron as CauldronTemplate,
} from '../../generated/templates/Cauldron/Cauldron';
import { getCauldron, getOrCreateFinancialCauldronMetricsDailySnapshot } from '../helpers/cauldron';
import { getOrCreateCollateral } from '../helpers/get-or-create-collateral';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { updateAccountState, updateLiquidationCount, updateTokenPrice, updateTotalMimBorrowed } from '../helpers/updates';
import { updateTvl, updateLastActive, updateFeesGenerated } from '../helpers/updates';
import { updateTokensPrice } from '../helpers/updates/update-tokens-price';
import { arrayUnique, bigIntToBigDecimal } from '../utils';
import { getOrCreateAccount, getOrCreateAccountState, getOrCreateAccountStateSnapshot } from '../helpers/account';
import { getOrCreateFinancialProtocolMetricsDailySnapshot, getOrCreateProtocol } from '../helpers/protocol';
import { BORROW_OPENING_FEE_PRECISION, LIQUIDATION_MULTIPLIER_PRECISION, DISTRIBUTION_PART, DISTRIBUTION_PRECISION, EventType, FeeType, BIGDECIMAL_ONE } from '../constants';

export function handleLogAddCollateral(event: LogAddCollateral): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateTokensPrice(event.block);
    updateAccountState(cauldron, event.params.to.toHexString(), EventType.DEPOSIT, event.params.share, event.block, event.transaction);
    updateTvl(event.block);
}

export function handleLogRemoveCollateral(event: LogRemoveCollateral): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateTokensPrice(event.block);
    updateAccountState(cauldron, event.params.from.toHexString(), EventType.WITHDRAW, event.params.share, event.block, event.transaction);
    updateTvl(event.block);
}

export function handleLogBorrow(event: LogBorrow): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateTokensPrice(event.block);
    updateAccountState(cauldron, event.params.from.toHexString(), EventType.BORROW, event.params.part, event.block, event.transaction);
    updateTotalMimBorrowed(event.block);
    const borrowAmountWithFee = bigIntToBigDecimal(event.params.amount);
    const borrowAmount = borrowAmountWithFee.div(cauldron.borrowOpeningFee.divDecimal(BORROW_OPENING_FEE_PRECISION.toBigDecimal()).plus(BIGDECIMAL_ONE));
    const feeAmount = borrowAmountWithFee.minus(borrowAmount);
    updateFeesGenerated(cauldron, feeAmount, event.block, FeeType.BORROW);
}

export function handleLiquidateCall(call: LiquidateCall): void {
    const cauldron = getCauldron(call.to.toHexString());
    if (!cauldron) return;
    if (cauldron.liquidationMultiplier.isZero()) return;

    updateLastActive(cauldron, call.block);
    const protocol = getOrCreateProtocol();
    const protocolDailySnapshot = getOrCreateFinancialProtocolMetricsDailySnapshot(call.block);
    const cauldronDailySnapshot = getOrCreateFinancialCauldronMetricsDailySnapshot(cauldron, call.block);

    const contract = CauldronTemplate.bind(Address.fromString(cauldron.id));
    const totalBorrowCall = contract.try_totalBorrow();
    if (totalBorrowCall.reverted) return;

    const totalBorrowBase = totalBorrowCall.value.getBase();
    const totalBorrowElastic = totalBorrowCall.value.getElastic();
    let allBorrowAmount = BigInt.fromI32(0);
    for (let i = 0; i < call.inputs.users.length; i++) {
        const account = getOrCreateAccount(cauldron, call.inputs.users[i].toHexString(), call.block);
        const accountState = getOrCreateAccountState(cauldron, account);
        const borrowPart = call.inputs.maxBorrowParts[i].gt(accountState.borrowPart) ? accountState.borrowPart : call.inputs.maxBorrowParts[i];
        const borrowAmount = borrowPart.times(totalBorrowElastic).div(totalBorrowBase);
        allBorrowAmount = allBorrowAmount.plus(borrowAmount);

        const accountStateSnapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, call.block, call.transaction);
        accountStateSnapshot.isLiquidated = true;
        accountStateSnapshot.liquidationPrice = cauldron.collateralPriceUsd;
        accountStateSnapshot.collateralPriceUsd = cauldron.collateralPriceUsd;
        accountStateSnapshot.save();

        protocol.liquidationAmountUsd = protocol.liquidationAmountUsd.plus(accountStateSnapshot.withdrawAmountUsd);
        protocol.repaidAmount = protocol.repaidAmount.plus(accountStateSnapshot.repaidUsd);
        protocol.save();

        cauldron.liquidationAmountUsd = cauldron.liquidationAmountUsd.plus(accountStateSnapshot.withdrawAmountUsd);
        cauldron.repaidAmount = cauldron.repaidAmount.plus(accountStateSnapshot.repaidUsd);
        cauldron.save();

        protocolDailySnapshot.liquidationAmountUsd = protocolDailySnapshot.liquidationAmountUsd.plus(accountStateSnapshot.withdrawAmountUsd);
        protocolDailySnapshot.repaidAmount = protocolDailySnapshot.repaidAmount.plus(accountStateSnapshot.repaidUsd);
        protocolDailySnapshot.save();

        cauldronDailySnapshot.liquidationAmountUsd = cauldronDailySnapshot.liquidationAmountUsd.plus(accountStateSnapshot.withdrawAmountUsd);
        cauldronDailySnapshot.repaidAmount = cauldronDailySnapshot.repaidAmount.plus(accountStateSnapshot.repaidUsd);
        cauldronDailySnapshot.save();
    }
    const accounts = arrayUnique(call.inputs.users);

    for (let i = 0; i < accounts.length; i++) {
        const account = getOrCreateAccount(cauldron, accounts[i].toHexString(), call.block);
        updateLiquidationCount(cauldron, account, call.block);
    }

    const distributionAmount = allBorrowAmount
        .times(cauldron.liquidationMultiplier)
        .div(LIQUIDATION_MULTIPLIER_PRECISION)
        .minus(allBorrowAmount)
        .times(DISTRIBUTION_PART)
        .div(DISTRIBUTION_PRECISION);
    updateFeesGenerated(cauldron, bigIntToBigDecimal(distributionAmount), call.block, FeeType.LIQUADATION);
}

export function handleLogRepay(event: LogRepay): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateTokensPrice(event.block);
    updateAccountState(cauldron, event.params.to.toHexString(), EventType.REPAY, event.params.part, event.block, event.transaction);
    updateTvl(event.block);
    updateTotalMimBorrowed(event.block);
}

export function handleLogExchangeRate(event: LogExchangeRate): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);

    const collateral = getOrCreateCollateral(Address.fromString(cauldron.collateral));

    cauldron.exchangeRate = event.params.rate;
    cauldron.save();

    updateTokenPrice(event.params.rate, collateral, cauldron, event.block);
    updateTvl(event.block);
}

export function handleLogAccrue(event: LogAccrue): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;

    updateLastActive(cauldron, event.block);
    updateFeesGenerated(cauldron, bigIntToBigDecimal(event.params.accruedAmount), event.block, FeeType.INTEREST);
}
