import { Address } from '@graphprotocol/graph-ts';
import { ERC20 } from '../../../generated/DegenBox/ERC20';
import { INVALID_TOKEN_DECIMALS } from 'misc';

export function getCollateralDecimals(address: Address): i32 {
    const contract = ERC20.bind(address);

    // try types uint8 for decimals
    const decimalResult = contract.try_decimals();
    if (!decimalResult.reverted) {
        return decimalResult.value;
    }

    return INVALID_TOKEN_DECIMALS;
}
