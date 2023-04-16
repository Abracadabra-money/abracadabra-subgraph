import { ethereum } from '@graphprotocol/graph-ts';
import { LevelFinanceDailySnapshot } from '../../../generated/schema';
import { BIGDECIMAL_ZERO, BIGINT_ZERO, SECONDS_PER_DAY } from '../../constants';
import { getOrCreateLevelFinance } from './get-or-create-level-finance';

export function getOrCreateLevelFinanceDailySnapshot(block: ethereum.Block): LevelFinanceDailySnapshot {
    const id: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;

    let levelFinanceDailySnapshot = LevelFinanceDailySnapshot.load(id.toString());
    if (levelFinanceDailySnapshot) return levelFinanceDailySnapshot;

    const levelFinance = getOrCreateLevelFinance();
    levelFinanceDailySnapshot = new LevelFinanceDailySnapshot(id.toString());
    levelFinanceDailySnapshot.levelFinance = levelFinance.id;
    levelFinanceDailySnapshot.juniorRewards = BIGINT_ZERO;
    levelFinanceDailySnapshot.juniorApy = BIGDECIMAL_ZERO;
    levelFinanceDailySnapshot.mezzanineRewards = BIGINT_ZERO;
    levelFinanceDailySnapshot.mezzanineApy = BIGDECIMAL_ZERO;
    levelFinanceDailySnapshot.seniorRewards = BIGINT_ZERO;
    levelFinanceDailySnapshot.seniorApy = BIGDECIMAL_ZERO;
    levelFinanceDailySnapshot.blockNumber = block.number;
    levelFinanceDailySnapshot.timestamp = block.timestamp;

    return levelFinanceDailySnapshot;
}
