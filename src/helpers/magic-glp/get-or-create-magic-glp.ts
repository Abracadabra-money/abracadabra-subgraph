import { MagicGlp } from '../../../generated/schema';
import { BIGDECIMAL_ZERO } from '../../constants';
import { getOrCreateProtocol } from '../get-or-create-protocol';
import { getMagicGlpAddress } from '../../helpers/get-magic-glp-address';
import { dataSource } from '@graphprotocol/graph-ts';

export function getOrCreateMagicGlp(): MagicGlp {
    const magicGlpAddress = getMagicGlpAddress(dataSource.network());
    let magicGlp = MagicGlp.load(magicGlpAddress);
    if (magicGlp) return magicGlp;
    const protocol = getOrCreateProtocol();

    magicGlp = new MagicGlp(magicGlpAddress);
    magicGlp.protocol = protocol.id;
    magicGlp.totalRewards = BIGDECIMAL_ZERO;
    magicGlp.save();

    return magicGlp;
}
