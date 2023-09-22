import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/schema';
import { EventType } from '../../constants';
import { bigIntToBigDecimal, getLiquidationPrice } from '../../utils';
import { getOrCreateAccount, getOrCreateAccountState, getOrCreateAccountStateSnapshot } from '../account';
import { getOrCreateCollateral } from '../get-or-create-collateral';
import { getOrCreateFinancialProtocolMetricsDailySnapshot, getOrCreateProtocol } from '../protocol';
import { getOrCreateFinancialCauldronMetricsDailySnapshot } from '../cauldron';

export function updateAccountState(
    cauldron: Cauldron,
    accountId: string,
    eventType: string,
    amount: BigInt,
    block: ethereum.Block,
    transaction: ethereum.Transaction,
    isLiquidate: boolean = false,
): void {
    const protocol = getOrCreateProtocol();
    const protocolDailySnapshot = getOrCreateFinancialProtocolMetricsDailySnapshot(block);
    const cauldronDailySnapshot = getOrCreateFinancialCauldronMetricsDailySnapshot(cauldron, block);
    const collateral = getOrCreateCollateral(Address.fromString(cauldron.collateral));
    const account = getOrCreateAccount(cauldron, accountId, block);
    const accountState = getOrCreateAccountState(cauldron, account);

    if (eventType == EventType.DEPOSIT) {
        accountState.collateralShare = accountState.collateralShare.plus(amount);
    }

    if (eventType == EventType.WITHDRAW) {
        accountState.collateralShare = accountState.collateralShare.minus(amount);
    }

    if (eventType == EventType.BORROW) {
        accountState.borrowPart = accountState.borrowPart.plus(amount);
    }

    if (eventType == EventType.REPAY) {
        accountState.borrowPart = accountState.borrowPart.minus(amount);
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
            cauldronDailySnapshot.liquidationAmountUsd = cauldronDailySnapshot.liquidationAmountUsd.plus(collateralWithdrawAmountUsd);
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
            cauldronDailySnapshot.repaidAmount = cauldronDailySnapshot.repaidAmount.plus(mimRepay);
        }
    }

    protocol.save();
    protocolDailySnapshot.save();
    cauldronDailySnapshot.save();
    cauldron.save();
    snapshot.save();

    accountState.lastAction = snapshot.id;
    accountState.save();
}
