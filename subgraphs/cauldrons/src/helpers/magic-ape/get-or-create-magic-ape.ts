import { MagicApe } from '../../../generated/schema';
import { BIGDECIMAL_ZERO } from '../../constants';
import { MAGIC_APE } from '../../constants';
import { getOrCreateProtocol } from '../protocol';

export function getOrCreateMagicApe(): MagicApe {
    let magicApe = MagicApe.load(MAGIC_APE);
    if (magicApe) return magicApe;
    const protocol = getOrCreateProtocol();

    magicApe = new MagicApe(MAGIC_APE);
    magicApe.protocol = protocol.id;
    magicApe.totalRewards = BIGDECIMAL_ZERO;
    magicApe.save();

    return magicApe;
}
