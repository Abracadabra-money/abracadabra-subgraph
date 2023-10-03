import { ethereum } from '@graphprotocol/graph-ts';
import { Account, Cauldron } from '../../../generated/schema';
import { getOrCreateProtocol, getOrCreateUsageProtocolMetricsDailySnapshot } from '../protocol';
import { getOrCreateUsageCauldronMetricsDailySnapshot } from '../cauldron';

export function updateLiquidationCount(cauldron: Cauldron, account: Account, block: ethereum.Block): void {
    const protocol = getOrCreateProtocol();
    protocol.liquidationCount = protocol.liquidationCount + 1;
    protocol.save();

    cauldron.liquidationCount = cauldron.liquidationCount + 1;
    cauldron.save();

    account.liquidationCount = account.liquidationCount + 1;
    account.save();

    const protocolSnapshot = getOrCreateUsageProtocolMetricsDailySnapshot(block);
    protocolSnapshot.liquidationCount = protocolSnapshot.liquidationCount + 1;
    protocolSnapshot.save();

    const cauldronSnapshot = getOrCreateUsageCauldronMetricsDailySnapshot(cauldron, block);
    cauldronSnapshot.liquidationCount = cauldronSnapshot.liquidationCount + 1;
    cauldronSnapshot.save();
}
