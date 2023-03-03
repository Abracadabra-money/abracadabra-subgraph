import { MagicGlp } from '../../../generated/schema';
import { BIGDECIMAL_ZERO } from '../../constants';
import { MAGIC_GLP } from '../../constants';
import { getOrCreateProtocol } from '../get-or-create-protocol';

export function getOrCreateMagicGlp(): MagicGlp {
    let magicGlp = MagicGlp.load(MAGIC_GLP);
    if (magicGlp) return magicGlp;
    const protocol = getOrCreateProtocol();

    magicGlp = new MagicGlp(MAGIC_GLP);
    magicGlp.protocol = protocol.id;
    magicGlp.totalRewards = BIGDECIMAL_ZERO;
    magicGlp.save();

    return magicGlp;
}
