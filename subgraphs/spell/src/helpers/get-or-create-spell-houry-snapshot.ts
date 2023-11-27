import { ethereum } from '@graphprotocol/graph-ts';
import { SpellHourySnapshot } from '../../generated/schema';
import { SECONDS_PER_HOUR, BIGINT_ONE, BIGDECIMAL_ZERO } from 'misc';
import { getOrCreateSpell } from './get-or-create-spell';

export function getOrCreateSpellHourySnapshot(block: ethereum.Block): SpellHourySnapshot {
    const timestamp = block.timestamp.toI32();
    const hourIndex = timestamp / SECONDS_PER_HOUR; // get unique hour within unix history
    const hourStartUnix = hourIndex * SECONDS_PER_HOUR; // want the rounded effect

    let snapshot = SpellHourySnapshot.load(hourStartUnix.toString());

    if (snapshot) return snapshot;

    const spell = getOrCreateSpell();

    snapshot = new SpellHourySnapshot(hourStartUnix.toString());
    snapshot.spell = spell.id;

    snapshot.minted = BIGDECIMAL_ZERO;
    snapshot.mintedUsd = BIGDECIMAL_ZERO;

    snapshot.burned = BIGDECIMAL_ZERO;
    snapshot.burnedUsd = BIGDECIMAL_ZERO;

    snapshot.totalMinted = BIGDECIMAL_ZERO;
    snapshot.totalMintedUsd = BIGDECIMAL_ZERO;

    snapshot.totalBurned = BIGDECIMAL_ZERO;
    snapshot.totalBurnedUsd = BIGDECIMAL_ZERO;

    snapshot.timestamp = hourStartUnix;

    snapshot.save();

    spell.hourySnapshotCount = spell.hourySnapshotCount.plus(BIGINT_ONE);
    spell.save();

    return snapshot;
}
