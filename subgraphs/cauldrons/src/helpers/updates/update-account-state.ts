import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/schema';
import { EventType } from '../../constants';
import { getLiquidationPrice } from '../../utils';
import { bigIntToBigDecimal } from 'misc';
import { getOrCreateAccount, getOrCreateAccountState, getOrCreateAccountStateSnapshot } from '../account';
import { getOrCreateCollateral } from '../collateral';
import { getOrCreateProtocolDailySnapshot, getOrCreateProtocolHourySnapshot, getOrCreateProtocol } from '../protocol';
import { getOrCreateCauldronDailySnapshot, getOrCreateCauldronHourySnapshot } from '../cauldron';

export function updateAccountState(
    cauldron: Cauldron,
    accountId: string,
    eventType: string,
    amount: BigInt,
    block: ethereum.Block,
    transaction: ethereum.Transaction,
    isLiquidate: boolean = false,
): void {
    const collateral = getOrCreateCollateral(Address.fromString(cauldron.collateral));
    const account = getOrCreateAccount(cauldron, accountId, block);
    const accountState = getOrCreateAccountState(cauldron, account);

    const protocol = getOrCreateProtocol();

    const protocolDailySnapshot = getOrCreateProtocolDailySnapshot(block);
    const protocolHourySnapshot = getOrCreateProtocolHourySnapshot(block);

    const cauldronDailySnapshot = getOrCreateCauldronDailySnapshot(cauldron, block);
    const cauldronHourySnapshot = getOrCreateCauldronHourySnapshot(cauldron, block);

    if (eventType == EventType.DEPOSIT) {
        accountState.collateralShare = accountState.collateralShare.plus(amount);

        const formatedAmount = bigIntToBigDecimal(amount, collateral.decimals);
        cauldron.totalCollateralShare = cauldron.totalCollateralShare.plus(formatedAmount);
        cauldronDailySnapshot.totalCollateralShare = cauldron.totalCollateralShare;
        cauldronHourySnapshot.totalCollateralShare = cauldron.totalCollateralShare;
    }

    if (eventType == EventType.WITHDRAW) {
        accountState.collateralShare = accountState.collateralShare.minus(amount);

        const formatedAmount = bigIntToBigDecimal(amount, collateral.decimals);
        cauldron.totalCollateralShare = cauldron.totalCollateralShare.minus(formatedAmount);
        cauldronDailySnapshot.totalCollateralShare = cauldron.totalCollateralShare;
        cauldronHourySnapshot.totalCollateralShare = cauldron.totalCollateralShare;
    }

    if (eventType == EventType.BORROW) {
        accountState.borrowPart = accountState.borrowPart.plus(amount);

        const mimBorrowed = bigIntToBigDecimal(amount);
        cauldron.totalMimBorrowed = cauldron.totalMimBorrowed.plus(mimBorrowed);
        cauldronDailySnapshot.totalMimBorrowed = cauldron.totalMimBorrowed;
        cauldronHourySnapshot.totalMimBorrowed = cauldron.totalMimBorrowed;

        protocol.totalMimBorrowed = protocol.totalMimBorrowed.plus(mimBorrowed);
        protocolDailySnapshot.totalMimBorrowed = protocol.totalMimBorrowed;
        protocolHourySnapshot.totalMimBorrowed = protocol.totalMimBorrowed;
    }

    if (eventType == EventType.REPAY) {
        accountState.borrowPart = accountState.borrowPart.minus(amount);

        const mimBorrowed = bigIntToBigDecimal(amount);
        cauldron.totalMimBorrowed = cauldron.totalMimBorrowed.minus(mimBorrowed);
        cauldronDailySnapshot.totalMimBorrowed = cauldron.totalMimBorrowed;
        cauldronHourySnapshot.totalMimBorrowed = cauldron.totalMimBorrowed;

        protocol.totalMimBorrowed = protocol.totalMimBorrowed.minus(mimBorrowed);
        protocolDailySnapshot.totalMimBorrowed = protocol.totalMimBorrowed;
        protocolHourySnapshot.totalMimBorrowed = protocol.totalMimBorrowed;
    }

    const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, block, transaction);
    snapshot.liquidationPrice = getLiquidationPrice(cauldron, collateral, accountState);
    snapshot.borrowPart = accountState.borrowPart;
    snapshot.collateralShare = accountState.collateralShare;
    snapshot.collateralPriceUsd = cauldron.collateralPriceUsd;

    if (isLiquidate) {
        snapshot.isLiquidated = true;
    }

    if (eventType == EventType.WITHDRAW) {
        snapshot.withdrawAmount = snapshot.withdrawAmount.plus(amount);

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

    if (eventType == EventType.REPAY) {
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
