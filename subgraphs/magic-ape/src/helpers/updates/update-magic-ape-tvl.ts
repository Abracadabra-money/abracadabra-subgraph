import { Address, ethereum, log } from '@graphprotocol/graph-ts';
import { MagicApe } from '../../../generated/MagicApe/MagicApe';
import { MAGIC_APE_ADDRESS } from '../../constants';
import { bigIntToBigDecimal } from 'misc';
import { getApePrice } from '../get-ape-price';
import { getOrCreateMagicApe } from '../get-or-create-magic-ape';
import { getOrCreateMagicApeDailySnapshot } from '../get-or-create-magic-ape-daily-snapshot';
import { getOrCreateMagicApeHourySnapshot } from '../get-or-create-magic-ape-houry-snapshot';

export function updateMagicApeTvl(block: ethereum.Block): void {
    const magicApe = getOrCreateMagicApe();
    const apePrice = getApePrice();
    const contract = MagicApe.bind(Address.fromString(MAGIC_APE_ADDRESS));

    const totalAssetsCall = contract.try_totalAssets();
    if (totalAssetsCall.reverted) {
        log.warning('[updateMagicApeTvl] MagicApe totalAssets failed', []);
        return;
    }

    const totalAssets = bigIntToBigDecimal(totalAssetsCall.value);

    const dailySnapshot = getOrCreateMagicApeDailySnapshot(block);
    dailySnapshot.magicApe = magicApe.id;
    dailySnapshot.totalValueLockedUsd = totalAssets.times(apePrice);
    dailySnapshot.save();

    const hourySnapshot = getOrCreateMagicApeHourySnapshot(block);
    hourySnapshot.magicApe = magicApe.id;
    hourySnapshot.totalValueLockedUsd = totalAssets.times(apePrice);
    hourySnapshot.save();
}
