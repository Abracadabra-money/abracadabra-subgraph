import {
    LogAccrue,
    LogBorrow,
    LogAddCollateral,
    LogRemoveCollateral,
    LogRepay,
    LogExchangeRate,
    BorrowCall,
    CookCall,
    LiquidateCall,
    Cauldron as CauldronTemplate,
} from '../../generated/templates/Cauldron/Cauldron';
import { getCauldron } from '../helpers/cauldron';
import { getOrCreateCollateral } from '../helpers/get-or-create-collateral';
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { updateAccountState, updateTokenPrice } from '../helpers/updates';
import { updateTvl, updateLastActive, updateFeesGenerated } from '../helpers/updates';
import { updateTokensPrice } from '../helpers/updates/update-tokens-price';
import { bigIntToBigDecimal } from '../utils';
import { BORROW_OPENING_FEE_PRECISION, ACTION_BORROW, LIQUIDATION_MULTIPLIER_PRECISION, DISTRIBUTION_PART, DISTRIBUTION_PRECISION, EventType, FeeType } from '../constants';
import { getOrCreateAccount, getOrCreateAccountState, getOrCreateAccountStateSnapshot } from '../helpers/account';

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
}

export function handleBorrowCall(call: BorrowCall): void {
    const cauldron = getCauldron(call.to.toHexString());
    if (!cauldron) return;
    if (cauldron.borrowOpeningFee.isZero()) return;
    updateLastActive(cauldron, call.block);
    const feeAmount = call.inputs.amount.times(cauldron.borrowOpeningFee).div(BORROW_OPENING_FEE_PRECISION);
    updateFeesGenerated(cauldron, bigIntToBigDecimal(feeAmount), call.block, FeeType.BORROW);
}

export function handleLiquidateCall(call: LiquidateCall): void {
    const cauldron = getCauldron(call.to.toHexString());
    if (!cauldron) return;
    if (cauldron.liquidationMultiplier.isZero()) return;
    updateLastActive(cauldron, call.block);
    const contract = CauldronTemplate.bind(Address.fromString(cauldron.id));
    const totalBorrowCall = contract.try_totalBorrow();
    if (totalBorrowCall.reverted) return;

    const totalBorrowBase = totalBorrowCall.value.getBase();
    const totalBorrowElastic = totalBorrowCall.value.getElastic();
    let allBorrowAmount = BigInt.fromI32(0);
    for (let i = 0; i < call.inputs.maxBorrowParts.length; i++) {
        const account = getOrCreateAccount(cauldron, call.inputs.users[i].toHexString(), call.block);
        const accountState = getOrCreateAccountState(cauldron, account);
        const borrowPart = call.inputs.maxBorrowParts[i].gt(accountState.borrowPart) ? accountState.borrowPart : call.inputs.maxBorrowParts[i];
        const borrowAmount = borrowPart.times(totalBorrowElastic).div(totalBorrowBase);
        allBorrowAmount = allBorrowAmount.plus(borrowAmount);

        const accountStateSnapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, call.block, call.transaction);
        accountStateSnapshot.isLiquidated = true;
        accountStateSnapshot.liquidationPrice = cauldron.collateralPriceUsd;
        accountStateSnapshot.save();
    }
    const distributionAmount = allBorrowAmount
        .times(cauldron.liquidationMultiplier)
        .div(LIQUIDATION_MULTIPLIER_PRECISION)
        .minus(allBorrowAmount)
        .times(DISTRIBUTION_PART)
        .div(DISTRIBUTION_PRECISION);
    updateFeesGenerated(cauldron, bigIntToBigDecimal(distributionAmount), call.block, FeeType.LIQUADATION);
}

export function handleCookCall(call: CookCall): void {
    const cauldron = getCauldron(call.to.toHexString());
    if (!cauldron) return;
    if (cauldron.borrowOpeningFee.isZero()) return;
    updateLastActive(cauldron, call.block);
    for (let i = 0; i < call.inputs.actions.length; i++) {
        const action = call.inputs.actions[i];
        if (action == ACTION_BORROW) {
            const decode = ethereum.decode('(int256,address)', call.inputs.datas[i])!.toTuple();
            const amount = decode[0].toBigInt();
            const feeAmount = amount.times(cauldron.borrowOpeningFee).div(BORROW_OPENING_FEE_PRECISION);
            updateFeesGenerated(cauldron, bigIntToBigDecimal(feeAmount), call.block, FeeType.BORROW);
        }
    }
}

export function handleLogRepay(event: LogRepay): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateTokensPrice(event.block);
    updateAccountState(cauldron, event.params.to.toHexString(), EventType.REPAY, event.params.part, event.block, event.transaction);
    updateTvl(event.block);
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
