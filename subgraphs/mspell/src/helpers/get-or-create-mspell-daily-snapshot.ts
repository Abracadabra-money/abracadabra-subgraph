import { ethereum } from '@graphprotocol/graph-ts';
import { MSpellDailySnapshot } from '../../generated/schema';
import { SECONDS_PER_DAY, BIGDECIMAL_ZERO, BIGINT_ONE } from 'misc';
import { getOrCreateMspell } from './get-or-create-mspell';

export function getOrCreateMspellDailySnapshot(block: ethereum.Block): MSpellDailySnapshot {
    const timestamp = block.timestamp.toI32();
    const dayID = timestamp / SECONDS_PER_DAY;
    const dayStartTimestamp = dayID * SECONDS_PER_DAY;

    let snapshot = MSpellDailySnapshot.load(dayStartTimestamp.toString());

    if (snapshot) return snapshot;

    const mspell = getOrCreateMspell();

    snapshot = new MSpellDailySnapshot(dayStartTimestamp.toString());
    snapshot.mspell = mspell.id;
    snapshot.totalValueLockedUsd = BIGDECIMAL_ZERO;
    snapshot.totalValueLocked = BIGDECIMAL_ZERO;
    snapshot.timestamp = dayStartTimestamp;

    snapshot.save();

    mspell.dailySnapshotCount = mspell.dailySnapshotCount.plus(BIGINT_ONE);
    mspell.save();

    return snapshot;
}
