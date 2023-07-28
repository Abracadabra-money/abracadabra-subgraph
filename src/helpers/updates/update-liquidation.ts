import { ethereum } from '@graphprotocol/graph-ts';
import { Account, Cauldron } from '../../../generated/schema';
import { getOrCreateAccountState, getOrCreateAccountStateSnapshot } from '../account';
import { getOrCreateFinancialCauldronMetricsDailySnapshot } from '../cauldron';
import { getOrCreateFinancialProtocolMetricsDailySnapshot, getOrCreateProtocol } from '../protocol';
import { updateLiquidationCount } from './update-liquidation-count';

export function updateLiquidation(cauldron: Cauldron, account: Account, block: ethereum.Block, transaction: ethereum.Transaction): void {
    const protocol = getOrCreateProtocol();

    const protocolDailySnapshot = getOrCreateFinancialProtocolMetricsDailySnapshot(block);
    const cauldronDailySnapshot = getOrCreateFinancialCauldronMetricsDailySnapshot(cauldron, block);

    const accountState = getOrCreateAccountState(cauldron, account);
    const accountStateSnapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, block, transaction);

    // Ensures that liquidationCount is only updated once per cauldron per account per tx
    if (!accountStateSnapshot.isLiquidated) {
        updateLiquidationCount(cauldron, account, block);
    }

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
