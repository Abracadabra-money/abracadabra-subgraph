import { Address } from '@graphprotocol/graph-ts';
import { Transfer } from '../../generated/MagicGlp/WETH';
import { MAGIC_GLP, DEFAULT_DECIMALS } from "../constants";
import { getOrCreateMagicGlp } from "../helpers/magic-glp/get-or-create-magic-glp";
import { bigIntToBigDecimal } from '../utils';

export function handleLogTransfer(event: Transfer): void {
    const address = event.params.to;

    if (!Address.fromString(MAGIC_GLP).equals(address)) return;

    const magicGlp = getOrCreateMagicGlp();
    const amount = bigIntToBigDecimal(event.params.value, DEFAULT_DECIMALS);

    magicGlp.totalRewards = magicGlp.totalRewards.plus(amount);
    magicGlp.save();
}