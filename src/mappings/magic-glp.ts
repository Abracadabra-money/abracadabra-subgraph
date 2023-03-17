import { Address, dataSource } from '@graphprotocol/graph-ts';
import { Transfer } from '../../generated/MagicGlp/WETH';
import { DEFAULT_DECIMALS } from '../constants';
import { getOrCreateMagicGlp } from '../helpers/magic-glp/get-or-create-magic-glp';
import { bigIntToBigDecimal } from '../utils';
import { getMagicGlpAddress } from '../helpers/get-magic-glp-address';

export function handleLogTransfer(event: Transfer): void {
    const address = event.params.to;

    const magicGlpAddress = getMagicGlpAddress(dataSource.network());
    if (!Address.fromString(magicGlpAddress).equals(address)) return;

    const magicGlp = getOrCreateMagicGlp();
    const amount = bigIntToBigDecimal(event.params.value, DEFAULT_DECIMALS);

    magicGlp.totalRewards = magicGlp.totalRewards.plus(amount);
    magicGlp.save();
}
