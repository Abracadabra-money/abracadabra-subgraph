import { ethereum } from '@graphprotocol/graph-ts';
import { MagicApeHourySnapshot } from '../../generated/schema';
import { BIGDECIMAL_ZERO, SECONDS_PER_HOUR } from 'misc';
import { getOrCreateMagicApe } from './get-or-create-magic-ape';

export function getOrCreateMagicApeHourySnapshot(block: ethereum.Block): MagicApeHourySnapshot {
    const timestamp = block.timestamp.toI32();
    const hourIndex = timestamp / SECONDS_PER_HOUR; // get unique hour within unix history
    const hourStartUnix = hourIndex * SECONDS_PER_HOUR; // want the rounded effect

    let snapshot = MagicApeHourySnapshot.load(hourStartUnix.toString());

    if (snapshot) return snapshot;

    const magicApe = getOrCreateMagicApe();

    snapshot = new MagicApeHourySnapshot(hourStartUnix.toString());
    snapshot.magicApe = magicApe.id;
    snapshot.apr = BIGDECIMAL_ZERO;
    snapshot.apy = BIGDECIMAL_ZERO;
    snapshot.rewards = BIGDECIMAL_ZERO;
    snapshot.totalValueLockedUsd = BIGDECIMAL_ZERO;
    snapshot.price = BIGDECIMAL_ZERO;
    snapshot.timestamp = hourStartUnix;

    return snapshot;
}
