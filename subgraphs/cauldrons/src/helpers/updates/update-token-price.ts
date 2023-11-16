import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { BIGDECIMAL_ZERO, BIGDECIMAL_ONE, bigIntToBigDecimal } from 'misc';
import { Collateral, Cauldron } from '../../../generated/schema';
import { getOrCreateCollateralDailySnapshot } from '../collateral/get-or-create-collateral-daily-snapshot';
import { getOrCreateCollateralHourySnapshot } from '../collateral/get-or-create-collateral-houry-snapshot';

export function updateTokenPrice(rate: BigInt, collateral: Collateral, cauldron: Cauldron, block: ethereum.Block): void {
    let price = BIGDECIMAL_ZERO;
    if (!rate.isZero()) {
        price = BIGDECIMAL_ONE.div(bigIntToBigDecimal(rate, collateral.decimals));
    }
    cauldron.collateralPriceUsd = price;
    cauldron.save();

    collateral.lastPriceUsd = price;
    collateral.lastPriceBlockNumber = block.number;
    collateral.lastPriceTimestamp = block.timestamp;
    collateral.save();

    const dailySnapshot = getOrCreateCollateralDailySnapshot(block, collateral);
    dailySnapshot.lastPriceUsd = price;
    dailySnapshot.save();

    const hourySnapshot = getOrCreateCollateralHourySnapshot(block, collateral);
    hourySnapshot.lastPriceUsd = price;
    hourySnapshot.save();
}
