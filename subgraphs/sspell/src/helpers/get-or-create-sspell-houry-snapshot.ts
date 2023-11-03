import { ethereum } from '@graphprotocol/graph-ts';
import { SSpellHourySnapshot } from '../../generated/schema';
import { BIGDECIMAL_ZERO, SECONDS_PER_HOUR, BIGINT_ONE } from 'misc';
import { getOrCreateSspell } from './get-or-create-sspell';

export function getOrCreateSspellHourySnapshot(block: ethereum.Block): SSpellHourySnapshot {
    const timestamp = block.timestamp.toI32();
    const hourIndex = timestamp / SECONDS_PER_HOUR; // get unique hour within unix history
    const hourStartUnix = hourIndex * SECONDS_PER_HOUR; // want the rounded effect

    let snapshot = SSpellHourySnapshot.load(hourStartUnix.toString());

    if (snapshot) return snapshot;

    const sspell = getOrCreateSspell();

    snapshot = new SSpellHourySnapshot(hourStartUnix.toString());
    snapshot.sspell = sspell.id;
    snapshot.totalValueLockedUsd = BIGDECIMAL_ZERO;
    snapshot.totalValueLocked = BIGDECIMAL_ZERO;
    snapshot.timestamp = hourStartUnix;

    snapshot.save();

    sspell.hourySnapshotCount = sspell.hourySnapshotCount.plus(BIGINT_ONE);
    sspell.save();

    return snapshot;
}
