import { Address, ethereum, log } from '@graphprotocol/graph-ts';
import { MagicApe } from '../../../generated/MagicApe/MagicApe';
import { MAGIC_APE_ADDRESS } from '../../constants';
import { bigIntToBigDecimal, exponentToBigInt, DEFAULT_DECIMALS } from 'misc';
import { getApePrice } from '../get-ape-price';
import { getOrCreateMagicApe } from '../get-or-create-magic-ape';
import { getOrCreateMagicApeDailySnapshot } from '../get-or-create-magic-ape-daily-snapshot';
import { getOrCreateMagicApeHourySnapshot } from '../get-or-create-magic-ape-houry-snapshot';

export function updateMagicApePrice(block: ethereum.Block): void {
    const magicApe = getOrCreateMagicApe();
    const apePrice = getApePrice();
    const contract = MagicApe.bind(Address.fromString(MAGIC_APE_ADDRESS));

    const convertToAssetsCall = contract.try_convertToAssets(exponentToBigInt(DEFAULT_DECIMALS));
    if (convertToAssetsCall.reverted) {
        return log.warning('[updateMagicApePrice] MagicApe convertToAssets failed', []);
    }

    const convertToAssets = bigIntToBigDecimal(convertToAssetsCall.value, DEFAULT_DECIMALS);

    const dailySnapshot = getOrCreateMagicApeDailySnapshot(block);
    dailySnapshot.magicApe = magicApe.id;
    dailySnapshot.price = convertToAssets.times(apePrice);
    dailySnapshot.save();

    const hourySnapshot = getOrCreateMagicApeHourySnapshot(block);
    hourySnapshot.magicApe = magicApe.id;
    hourySnapshot.price = convertToAssets.times(apePrice);
    hourySnapshot.save();
}
