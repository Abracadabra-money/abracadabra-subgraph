import { ethereum } from '@graphprotocol/graph-ts';
import { BIGDECIMAL_ZERO, SECONDS_PER_DAY } from '../../constants';
import { Cauldron, FinanceialCauldronMetricsDailySnapshot } from '../../../generated/schema';

export function getOrCreateFinanceialCauldronMetricsDailySnapshot(cauldron: Cauldron, block: ethereum.Block): FinanceialCauldronMetricsDailySnapshot {
    const id: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;

    let dailySnapshot = FinanceialCauldronMetricsDailySnapshot.load(id.toString());

    if (dailySnapshot) return dailySnapshot;

    dailySnapshot = new FinanceialCauldronMetricsDailySnapshot(id.toString());
    dailySnapshot.cauldron = cauldron.id;
    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;
    dailySnapshot.totalValueLockedUsd = BIGDECIMAL_ZERO;
    dailySnapshot.feesGenerated = BIGDECIMAL_ZERO;
    dailySnapshot.borrowFeesGenerated = BIGDECIMAL_ZERO;
    dailySnapshot.interestFeesGenerated = BIGDECIMAL_ZERO;
    dailySnapshot.liquidationFeesGenerated = BIGDECIMAL_ZERO;
    dailySnapshot.liquidationAmountUsd = BIGDECIMAL_ZERO;
    dailySnapshot.repaidAmount = BIGDECIMAL_ZERO;

    return dailySnapshot;
}
