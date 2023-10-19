import { Address } from '@graphprotocol/graph-ts';
import { ERC20 } from '../../../generated/DegenBox/ERC20';
import { NameBytes } from '../../../generated/DegenBox/NameBytes';
import { UNKNOWN_TOKEN_VALUE } from 'misc';
import { isNullEthValue } from '../../utils';

export function getCollateralName(address: Address): string {
    const contract = ERC20.bind(address);
    const contractNameBytes = NameBytes.bind(address);

    // try types string and bytes32 for name
    let nameValue = UNKNOWN_TOKEN_VALUE;
    const nameResult = contract.try_name();
    if (!nameResult.reverted) {
        return nameResult.value;
    }

    // non-standard ERC20 implementation
    const nameResultBytes = contractNameBytes.try_name();
    if (!nameResultBytes.reverted) {
        // for broken exchanges that have no name function exposed
        if (!isNullEthValue(nameResultBytes.value.toHexString())) {
            nameValue = nameResultBytes.value.toString();
        }
    }

    return nameValue;
}
