import { ethereum } from '@graphprotocol/graph-ts';
import { MagicApeYieldDailySnapshot } from '../../../generated/schema';
import { SECONDS_PER_DAY, BIGDECIMAL_ZERO } from '../../constants';
import { getOrCreateMagicApe } from './get-or-create-magic-ape';

export function getOrCreateMagicApeYieldDailySnapshot(block: ethereum.Block): MagicApeYieldDailySnapshot {
    const id: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;

    let dailySnapshot = MagicApeYieldDailySnapshot.load(id.toString());

    if (dailySnapshot) return dailySnapshot;

    const magicApe = getOrCreateMagicApe();

    dailySnapshot = new MagicApeYieldDailySnapshot(id.toString());
    dailySnapshot.magicApe = magicApe.id;
    dailySnapshot.apr = BIGDECIMAL_ZERO;
    dailySnapshot.apy = BIGDECIMAL_ZERO;
    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;

    return dailySnapshot;
}
