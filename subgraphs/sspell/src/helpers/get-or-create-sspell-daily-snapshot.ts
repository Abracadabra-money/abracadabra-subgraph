import { ethereum } from '@graphprotocol/graph-ts';
import { SSpellDailySnapshot } from '../../generated/schema';
import { SECONDS_PER_DAY, BIGDECIMAL_ZERO, BIGINT_ONE } from 'misc';
import { getOrCreateSspell } from './get-or-create-sspell';

export function getOrCreateSspellDailySnapshot(block: ethereum.Block): SSpellDailySnapshot {
    const timestamp = block.timestamp.toI32();
    const dayID = timestamp / SECONDS_PER_DAY;
    const dayStartTimestamp = dayID * SECONDS_PER_DAY;

    let snapshot = SSpellDailySnapshot.load(dayStartTimestamp.toString());

    if (snapshot) return snapshot;

    const sspell = getOrCreateSspell();

    snapshot = new SSpellDailySnapshot(dayStartTimestamp.toString());
    snapshot.sspell = sspell.id;
    snapshot.totalValueLockedUsd = BIGDECIMAL_ZERO;
    snapshot.totalValueLocked = BIGDECIMAL_ZERO;
    snapshot.timestamp = dayStartTimestamp;

    snapshot.save();

    sspell.dailySnapshotCount = sspell.dailySnapshotCount.plus(BIGINT_ONE);
    sspell.save();

    return snapshot;
}
