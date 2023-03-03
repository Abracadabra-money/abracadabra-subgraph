import { ethereum } from '@graphprotocol/graph-ts';
import { MagicApeRewardsDailySnapshot } from '../../../generated/schema';
import { SECONDS_PER_DAY, BIGDECIMAL_ZERO } from '../../constants';
import { getOrCreateMagicApe } from './get-or-create-magic-ape';

export function getOrCreateMagicApeRewardsDailySnapshot(block: ethereum.Block): MagicApeRewardsDailySnapshot {
    const id: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;

    let dailySnapshot = MagicApeRewardsDailySnapshot.load(id.toString());

    if (dailySnapshot) return dailySnapshot;

    const magicApe = getOrCreateMagicApe();

    dailySnapshot = new MagicApeRewardsDailySnapshot(id.toString());
    dailySnapshot.magicApe = magicApe.id;
    dailySnapshot.rewards = BIGDECIMAL_ZERO;
    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;

    return dailySnapshot;
}
