import { MSpell } from '../../generated/schema';
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';
import { MSPELL_ADDRESS } from '../constants';

export function getOrCreateMspell(): MSpell {
    let mspell = MSpell.load(MSPELL_ADDRESS);
    if (mspell) return mspell;

    mspell = new MSpell(MSPELL_ADDRESS);
    mspell.totalValueLockedUsd = BIGDECIMAL_ZERO;
    mspell.totalValueLocked = BIGDECIMAL_ZERO;
    mspell.dailySnapshotCount = BIGINT_ZERO;
    mspell.hourySnapshotCount = BIGINT_ZERO;
    mspell.save();

    return mspell;
}
