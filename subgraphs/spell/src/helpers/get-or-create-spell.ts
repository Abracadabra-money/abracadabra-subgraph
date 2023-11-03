import { Spell } from '../../generated/schema';
import { BIGINT_ZERO, BIGDECIMAL_ZERO } from 'misc';
import { SPELL_ADDRESS } from '../constants';

export function getOrCreateSpell(): Spell {
    let spell = Spell.load(SPELL_ADDRESS);
    if (spell) return spell;

    spell = new Spell(SPELL_ADDRESS);
    spell.totalMinted = BIGDECIMAL_ZERO;
    spell.totalMintedUsd = BIGDECIMAL_ZERO;

    spell.totalBurned = BIGDECIMAL_ZERO;
    spell.totalBurnedUsd = BIGDECIMAL_ZERO;

    spell.dailySnapshotCount = BIGINT_ZERO;
    spell.hourySnapshotCount = BIGINT_ZERO;
    spell.save();

    return spell;
}
