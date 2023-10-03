import { Address } from '@graphprotocol/graph-ts';
import { Transfer } from '../../generated/MagicGlp/WETH';
import { getOrCreateMagicGlp } from '../helpers/get-or-create-magic-glp';
import { bigIntToBigDecimal } from 'misc';
import { MAGIC_GLP_ADDRESS } from '../constants';

export function handleLogTransfer(event: Transfer): void {
    const address = event.params.to;

    if (!Address.fromString(MAGIC_GLP_ADDRESS).equals(address)) return;

    const magicGlp = getOrCreateMagicGlp();
    const amount = bigIntToBigDecimal(event.params.value);

    magicGlp.totalRewards = magicGlp.totalRewards.plus(amount);
    magicGlp.save();
}
