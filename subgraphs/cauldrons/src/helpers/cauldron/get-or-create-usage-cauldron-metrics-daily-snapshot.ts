import { ethereum } from '@graphprotocol/graph-ts';
import { SECONDS_PER_DAY } from '../../constants';
import { Cauldron, UsageCauldronMetricsDailySnapshot } from '../../../generated/schema';

export function getOrCreateUsageCauldronMetricsDailySnapshot(cauldron: Cauldron, block: ethereum.Block): UsageCauldronMetricsDailySnapshot {
    const id: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;

    let dailySnapshot = UsageCauldronMetricsDailySnapshot.load(id.toString());

    if (dailySnapshot) return dailySnapshot;

    dailySnapshot = new UsageCauldronMetricsDailySnapshot(id.toString());
    dailySnapshot.cauldron = cauldron.id;
    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;
    dailySnapshot.cumulativeUniqueUsers = 0;
    dailySnapshot.liquidationCount = 0;

    return dailySnapshot;
}
