import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { BIGDECIMAL_ZERO, BIGINT_ZERO, BIGDECIMAL_ONE } from '../../constants';
import { Collateral, Cauldron } from '../../../generated/schema';
import { bigIntToBigDecimal } from '../../utils';

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
}
