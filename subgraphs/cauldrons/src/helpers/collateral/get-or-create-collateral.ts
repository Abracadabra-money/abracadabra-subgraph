import { Address } from '@graphprotocol/graph-ts';
import { Collateral } from '../../../generated/schema';
import { getCollateralDecimals } from './get-collateral-decimals';
import { getCollateralName } from './get-collateral-name';
import { getCollateralSymbol } from './get-collateral-symbol';
import { DEFAULT_DECIMALS, BIGINT_ZERO, BIGDECIMAL_ONE, BIGDECIMAL_ZERO } from 'misc';
import { USD_BTC_ETH_ABRA_ADDRESS, MIM_ADDRESS } from '../../constants';

export function getOrCreateCollateral(address: Address): Collateral {
    let collateral = Collateral.load(address.toHexString());
    if (!collateral) {
        collateral = new Collateral(address.toHexString());
        collateral.symbol = getCollateralSymbol(address);
        collateral.name = getCollateralName(address);
        if (address == Address.fromString(USD_BTC_ETH_ABRA_ADDRESS)) {
            collateral.decimals = DEFAULT_DECIMALS;
        } else {
            collateral.decimals = getCollateralDecimals(address);
        }

        collateral.lastPriceUsd = address == Address.fromString(MIM_ADDRESS) ? BIGDECIMAL_ONE : BIGDECIMAL_ZERO;
        collateral.lastPriceBlockNumber = BIGINT_ZERO;
        collateral.lastPriceTimestamp = BIGINT_ZERO;
        collateral.save();
    }
    return collateral;
}
