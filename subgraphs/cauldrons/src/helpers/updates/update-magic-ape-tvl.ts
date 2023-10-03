import { Address, ethereum, log } from '@graphprotocol/graph-ts';
import { MagicApe } from '../../../generated/MagicApe/MagicApe';
import { MAGIC_APE, DEFAULT_DECIMALS } from '../../constants';
import { bigIntToBigDecimal } from '../../utils';
import { getApePrice } from '../get-ape-price';
import { getOrCreateMagicApe } from '../magic-ape/get-or-create-magic-ape';
import { getOrCreateMagicApeTvlDailySnapshot } from '../magic-ape/get-or-create-magic-ape-tvl-daily-snapshot';

export function updateMagicApeTvl(block: ethereum.Block): void {
    const magicApe = getOrCreateMagicApe();
    const apePrice = getApePrice();
    const contract = MagicApe.bind(Address.fromString(MAGIC_APE));
    const dailySnapshot = getOrCreateMagicApeTvlDailySnapshot(block);

    const totalAssetsCall = contract.try_totalAssets();
    if (totalAssetsCall.reverted) {
        log.warning('[updateMagicApeTvl] MagicApe totalAssets failed', []);
        return;
    }

    const totalAssets = bigIntToBigDecimal(totalAssetsCall.value, DEFAULT_DECIMALS);

    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;
    dailySnapshot.magicApe = magicApe.id;
    dailySnapshot.totalValueLockedUsd = totalAssets.times(apePrice);
    dailySnapshot.save();
}
