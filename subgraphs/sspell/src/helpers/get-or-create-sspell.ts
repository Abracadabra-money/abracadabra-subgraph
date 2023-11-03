import { SSpell } from '../../generated/schema';
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';
import { SSPELL_ADDRESS } from '../constants';

export function getOrCreateSspell(): SSpell {
    let sspell = SSpell.load(SSPELL_ADDRESS);
    if (sspell) return sspell;

    sspell = new SSpell(SSPELL_ADDRESS);
    sspell.totalValueLockedUsd = BIGDECIMAL_ZERO;
    sspell.totalValueLocked = BIGDECIMAL_ZERO;
    sspell.dailySnapshotCount = BIGINT_ZERO;
    sspell.hourySnapshotCount = BIGINT_ZERO;
    sspell.save();

    return sspell;
}
