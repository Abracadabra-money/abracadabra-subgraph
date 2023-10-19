import { ethereum } from '@graphprotocol/graph-ts';
import { LevelFinanceDailySnapshot } from '../../generated/schema';
import { getOrCreateLevelFinance } from './get-or-create-level-finance';
import { SECONDS_PER_DAY, BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';

export function getOrCreateLevelFinanceDailySnapshot(block: ethereum.Block): LevelFinanceDailySnapshot {
    const timestamp = block.timestamp.toI32();
    const dayID = timestamp / SECONDS_PER_DAY;
    const dayStartTimestamp = dayID * SECONDS_PER_DAY;

    let snapshot = LevelFinanceDailySnapshot.load(dayStartTimestamp.toString());
    if (snapshot) return snapshot;

    const levelFinance = getOrCreateLevelFinance();
    snapshot = new LevelFinanceDailySnapshot(dayStartTimestamp.toString());
    snapshot.levelFinance = levelFinance.id;
    snapshot.juniorRewards = BIGINT_ZERO;
    snapshot.juniorApy = BIGDECIMAL_ZERO;
    snapshot.mezzanineRewards = BIGINT_ZERO;
    snapshot.mezzanineApy = BIGDECIMAL_ZERO;
    snapshot.seniorRewards = BIGINT_ZERO;
    snapshot.seniorApy = BIGDECIMAL_ZERO;
    snapshot.timestamp = dayStartTimestamp;
    snapshot.save();

    return snapshot;
}
