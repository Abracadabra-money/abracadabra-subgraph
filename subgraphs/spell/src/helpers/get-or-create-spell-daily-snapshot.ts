import { ethereum } from '@graphprotocol/graph-ts';
import { SpellDailySnapshot } from '../../generated/schema';
import { SECONDS_PER_DAY, BIGINT_ONE, BIGDECIMAL_ZERO } from 'misc';
import { getOrCreateSpell } from './get-or-create-spell';

export function getOrCreateSpellDailySnapshot(block: ethereum.Block): SpellDailySnapshot {
    const timestamp = block.timestamp.toI32();
    const dayID = timestamp / SECONDS_PER_DAY;
    const dayStartTimestamp = dayID * SECONDS_PER_DAY;

    let snapshot = SpellDailySnapshot.load(dayStartTimestamp.toString());

    if (snapshot) return snapshot;

    const spell = getOrCreateSpell();

    snapshot = new SpellDailySnapshot(dayStartTimestamp.toString());
    snapshot.spell = spell.id;

    snapshot.minted = BIGDECIMAL_ZERO;
    snapshot.mintedUsd = BIGDECIMAL_ZERO;

    snapshot.burned = BIGDECIMAL_ZERO;
    snapshot.burnedUsd = BIGDECIMAL_ZERO;

    snapshot.timestamp = dayStartTimestamp;
    snapshot.save();

    spell.dailySnapshotCount = spell.dailySnapshotCount.plus(BIGINT_ONE);
    spell.save();

    return snapshot;
}
