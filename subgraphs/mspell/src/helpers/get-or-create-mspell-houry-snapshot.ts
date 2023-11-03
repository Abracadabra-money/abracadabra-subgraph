import { ethereum } from '@graphprotocol/graph-ts';
import { MSpellHourySnapshot } from '../../generated/schema';
import { BIGDECIMAL_ZERO, SECONDS_PER_HOUR, BIGINT_ONE } from 'misc';
import { getOrCreateMspell } from './get-or-create-mspell';

export function getOrCreateMspellHourySnapshot(block: ethereum.Block): MSpellHourySnapshot {
    const timestamp = block.timestamp.toI32();
    const hourIndex = timestamp / SECONDS_PER_HOUR; // get unique hour within unix history
    const hourStartUnix = hourIndex * SECONDS_PER_HOUR; // want the rounded effect

    let snapshot = MSpellHourySnapshot.load(hourStartUnix.toString());

    if (snapshot) return snapshot;

    const mspell = getOrCreateMspell();

    snapshot = new MSpellHourySnapshot(hourStartUnix.toString());
    snapshot.mspell = mspell.id;
    snapshot.totalValueLockedUsd = BIGDECIMAL_ZERO;
    snapshot.totalValueLocked = BIGDECIMAL_ZERO;
    snapshot.timestamp = hourStartUnix;

    snapshot.save();

    mspell.hourySnapshotCount = mspell.hourySnapshotCount.plus(BIGINT_ONE);
    mspell.save();

    return snapshot;
}
