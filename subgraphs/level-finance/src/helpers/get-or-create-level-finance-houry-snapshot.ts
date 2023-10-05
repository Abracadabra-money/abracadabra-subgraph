import { ethereum } from '@graphprotocol/graph-ts';
import { LevelFinanceHourySnapshot } from '../../generated/schema';
import { getOrCreateLevelFinance } from './get-or-create-level-finance';
import { SECONDS_PER_HOUR, BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';

export function getOrCreateLevelFinanceHourySnapshot(block: ethereum.Block): LevelFinanceHourySnapshot {
    const timestamp = block.timestamp.toI32();
    const hourIndex = timestamp / SECONDS_PER_HOUR; // get unique hour within unix history
    const hourStartUnix = hourIndex * SECONDS_PER_HOUR; // want the rounded effect

    let snapshot = LevelFinanceHourySnapshot.load(hourStartUnix.toString());
    if (snapshot) return snapshot;

    const levelFinance = getOrCreateLevelFinance();
    snapshot = new LevelFinanceHourySnapshot(hourStartUnix.toString());
    snapshot.levelFinance = levelFinance.id;
    snapshot.juniorRewards = BIGINT_ZERO;
    snapshot.juniorApy = BIGDECIMAL_ZERO;
    snapshot.mezzanineRewards = BIGINT_ZERO;
    snapshot.mezzanineApy = BIGDECIMAL_ZERO;
    snapshot.seniorRewards = BIGINT_ZERO;
    snapshot.seniorApy = BIGDECIMAL_ZERO;
    snapshot.timestamp = hourStartUnix;
    snapshot.save();

    return snapshot;
}
