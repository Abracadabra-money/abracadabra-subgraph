import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/schema';
import { BIGINT_ZERO } from 'misc';
import { getLiquidationPrice } from '../../utils';
import { bigIntToBigDecimal } from 'misc';
import { getOrCreateAccount, getOrCreateAccountState, getOrCreateAccountStateSnapshot } from '../account';
import { getOrCreateCollateral } from '../collateral';
import { getOrCreateProtocolDailySnapshot, getOrCreateProtocolHourySnapshot, getOrCreateProtocol } from '../protocol';
import { getOrCreateCauldronDailySnapshot, getOrCreateCauldronHourySnapshot } from '../cauldron';

export function updateAccountState(
    cauldron: Cauldron,
    accountId: string,
    share: BigInt,
    part: BigInt,
    amount: BigInt,
    borrowFees: BigInt,
    block: ethereum.Block,
    transaction: ethereum.Transaction,
    isLiquidate: boolean = false,
): void {
    const protocol = getOrCreateProtocol();

    const protocolDailySnapshot = getOrCreateProtocolDailySnapshot(block);
    const protocolHourySnapshot = getOrCreateProtocolHourySnapshot(block);

    const cauldronDailySnapshot = getOrCreateCauldronDailySnapshot(cauldron, block);
    const cauldronHourySnapshot = getOrCreateCauldronHourySnapshot(cauldron, block);

    const collateral = getOrCreateCollateral(Address.fromString(cauldron.collateral));
    const account = getOrCreateAccount(cauldron, accountId, block);
    const accountState = getOrCreateAccountState(cauldron, account);

    accountState.collateralShare = accountState.collateralShare.plus(share);
    accountState.borrowPart = accountState.borrowPart.plus(part);
    accountState.borrowFeesPaid = accountState.borrowFeesPaid.plus(borrowFees);

    cauldron.totalCollateralShare = cauldron.totalCollateralShare.plus(bigIntToBigDecimal(share));
    cauldronDailySnapshot.totalCollateralShare = cauldron.totalCollateralShare;
    cauldronHourySnapshot.totalCollateralShare = cauldron.totalCollateralShare;

    cauldron.totalMimBorrowed = cauldron.totalMimBorrowed.plus(bigIntToBigDecimal(amount));
    cauldronDailySnapshot.totalMimBorrowed = cauldron.totalMimBorrowed;
    cauldronHourySnapshot.totalMimBorrowed = cauldron.totalMimBorrowed;

    if (amount.gt(BIGINT_ZERO)) {
        accountState.cumulativeBorrowAmount = accountState.cumulativeBorrowAmount.plus(amount);
    } else {
        accountState.cumulativeRepayAmount = accountState.cumulativeRepayAmount.plus(amount.neg());
    }

    const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, block, transaction);

    if (isLiquidate) {
        snapshot.isLiquidated = true;
    }

    snapshot.liquidationPrice = getLiquidationPrice(cauldron, collateral, accountState);
    snapshot.borrowPart = accountState.borrowPart;
    snapshot.collateralShare = accountState.collateralShare;
    snapshot.collateralPriceUsd = cauldron.collateralPriceUsd;

    if (share.lt(BIGINT_ZERO)) {
        snapshot.withdrawAmount = snapshot.withdrawAmount.plus(share);

        const collateralWithdrawAmountUsd = bigIntToBigDecimal(amount, collateral.decimals).times(collateral.lastPriceUsd);
        snapshot.withdrawAmountUsd = snapshot.withdrawAmountUsd.plus(collateralWithdrawAmountUsd);

        if (isLiquidate) {
            protocol.liquidationAmountUsd = protocol.liquidationAmountUsd.plus(collateralWithdrawAmountUsd);
            cauldron.liquidationAmountUsd = cauldron.liquidationAmountUsd.plus(collateralWithdrawAmountUsd);

            protocolDailySnapshot.liquidationAmountUsd = protocolDailySnapshot.liquidationAmountUsd.plus(collateralWithdrawAmountUsd);
            protocolHourySnapshot.liquidationAmountUsd = protocolHourySnapshot.liquidationAmountUsd.plus(collateralWithdrawAmountUsd);

            cauldronDailySnapshot.liquidationAmountUsd = cauldronDailySnapshot.liquidationAmountUsd.plus(collateralWithdrawAmountUsd);
            cauldronHourySnapshot.liquidationAmountUsd = cauldronHourySnapshot.liquidationAmountUsd.plus(collateralWithdrawAmountUsd);
        }
    }

    if (amount.lt(BIGINT_ZERO)) {
        snapshot.repaid = snapshot.repaid.plus(amount);

        const mimRepay = bigIntToBigDecimal(amount);
        snapshot.repaidUsd = snapshot.repaidUsd.plus(mimRepay);

        if (isLiquidate) {
            protocol.repaidAmount = protocol.repaidAmount.plus(mimRepay);
            cauldron.repaidAmount = cauldron.repaidAmount.plus(mimRepay);

            protocolDailySnapshot.repaidAmount = protocolDailySnapshot.repaidAmount.plus(mimRepay);
            protocolHourySnapshot.repaidAmount = protocolHourySnapshot.repaidAmount.plus(mimRepay);

            cauldronDailySnapshot.repaidAmount = cauldronDailySnapshot.repaidAmount.plus(mimRepay);
            cauldronHourySnapshot.repaidAmount = cauldronHourySnapshot.repaidAmount.plus(mimRepay);
        }
    }

    protocol.save();

    protocolDailySnapshot.save();
    protocolHourySnapshot.save();

    cauldronDailySnapshot.save();
    cauldronHourySnapshot.save();

    cauldron.save();
    snapshot.save();

    accountState.lastAction = snapshot.id;
    accountState.save();
}
