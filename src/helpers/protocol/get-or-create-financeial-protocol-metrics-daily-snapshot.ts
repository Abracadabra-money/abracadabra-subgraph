import { ethereum } from '@graphprotocol/graph-ts';
import { BIGDECIMAL_ZERO, SECONDS_PER_DAY } from '../../constants';
import { FinanceialProtocolMetricsDailySnapshot } from '../../../generated/schema';
import { getOrCreateProtocol } from './get-or-create-protocol';

export function getOrCreateFinanceialProtocolMetricsDailySnapshot(block: ethereum.Block): FinanceialProtocolMetricsDailySnapshot {
    const id: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;

    let dailySnapshot = FinanceialProtocolMetricsDailySnapshot.load(id.toString());

    if (dailySnapshot) return dailySnapshot;

    const protocol = getOrCreateProtocol();

    dailySnapshot = new FinanceialProtocolMetricsDailySnapshot(id.toString());
    dailySnapshot.protocol = protocol.id;
    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;
    dailySnapshot.totalValueLockedUsd = protocol.totalValueLockedUsd;
    dailySnapshot.feesGenerated = BIGDECIMAL_ZERO;
    dailySnapshot.borrowFeesGenerated = BIGDECIMAL_ZERO;
    dailySnapshot.interestFeesGenerated = BIGDECIMAL_ZERO;
    dailySnapshot.liquidationFeesGenerated = BIGDECIMAL_ZERO;
    dailySnapshot.liquidationAmountUsd = BIGDECIMAL_ZERO;
    dailySnapshot.repaidAmount = BIGDECIMAL_ZERO;
    dailySnapshot.totalMimBorrowed = protocol.totalMimBorrowed;

    return dailySnapshot;
}
