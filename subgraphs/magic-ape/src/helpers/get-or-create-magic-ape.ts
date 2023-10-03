import { MagicApe } from '../../generated/schema';
import { BIGDECIMAL_ZERO } from 'misc';
import { MAGIC_APE_ADDRESS } from '../constants';

export function getOrCreateMagicApe(): MagicApe {
    let magicApe = MagicApe.load(MAGIC_APE_ADDRESS);
    if (magicApe) return magicApe;

    magicApe = new MagicApe(MAGIC_APE_ADDRESS);
    magicApe.totalRewards = BIGDECIMAL_ZERO;
    magicApe.apr = BIGDECIMAL_ZERO;
    magicApe.apy = BIGDECIMAL_ZERO;
    magicApe.save();

    return magicApe;
}
