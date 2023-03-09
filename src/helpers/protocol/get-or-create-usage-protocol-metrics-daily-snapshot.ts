import { ethereum } from '@graphprotocol/graph-ts';
import { SECONDS_PER_DAY } from '../../constants';
import { UsageProtocolMetricsDailySnapshot } from '../../../generated/schema';
import { getOrCreateProtocol } from './get-or-create-protocol';

export function getOrCreateUsageProtocolMetricsDailySnapshot(block: ethereum.Block): UsageProtocolMetricsDailySnapshot {
    const id: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;

    let dailySnapshot = UsageProtocolMetricsDailySnapshot.load(id.toString());

    if (dailySnapshot) return dailySnapshot;

    const protocol = getOrCreateProtocol();

    dailySnapshot = new UsageProtocolMetricsDailySnapshot(id.toString());
    dailySnapshot.protocol = protocol.id;
    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;
    dailySnapshot.cumulativeUniqueUsers = 0;

    return dailySnapshot;
}
