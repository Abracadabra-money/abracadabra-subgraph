import { MagicGlp } from '../../generated/schema';
import { BIGDECIMAL_ZERO } from 'misc';
import { MAGIC_GLP_ADDRESS } from '../constants';

export function getOrCreateMagicGlp(): MagicGlp {
    let magicGlp = MagicGlp.load(MAGIC_GLP_ADDRESS);
    if (magicGlp) return magicGlp;

    magicGlp = new MagicGlp(MAGIC_GLP_ADDRESS);
    magicGlp.totalRewards = BIGDECIMAL_ZERO;
    magicGlp.save();

    return magicGlp;
}
