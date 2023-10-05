import { ethereum } from '@graphprotocol/graph-ts';
import { MagicApeDailySnapshot } from '../../generated/schema';
import { SECONDS_PER_DAY, BIGDECIMAL_ZERO } from 'misc';
import { getOrCreateMagicApe } from './get-or-create-magic-ape';

export function getOrCreateMagicApeDailySnapshot(block: ethereum.Block): MagicApeDailySnapshot {
    const timestamp = block.timestamp.toI32();
    const dayID = timestamp / SECONDS_PER_DAY;
    const dayStartTimestamp = dayID * SECONDS_PER_DAY;

    let snapshot = MagicApeDailySnapshot.load(dayStartTimestamp.toString());

    if (snapshot) return snapshot;

    const magicApe = getOrCreateMagicApe();

    snapshot = new MagicApeDailySnapshot(dayStartTimestamp.toString());
    snapshot.magicApe = magicApe.id;
    snapshot.apr = BIGDECIMAL_ZERO;
    snapshot.apy = BIGDECIMAL_ZERO;
    snapshot.rewards = BIGDECIMAL_ZERO;
    snapshot.totalValueLockedUsd = BIGDECIMAL_ZERO;
    snapshot.price = BIGDECIMAL_ZERO;
    snapshot.timestamp = dayStartTimestamp;

    snapshot.save();

    return snapshot;
}
