import { Address } from '@graphprotocol/graph-ts';
import { ERC20 } from '../../../generated/DegenBox/ERC20';
import { SymbolBytes } from '../../../generated/DegenBox/SymbolBytes';
import { UNKNOWN_TOKEN_VALUE } from 'misc';
import { isNullEthValue } from '../../utils';

export function getCollateralSymbol(address: Address): string {
    const contract = ERC20.bind(address);
    const contractSymbolBytes = SymbolBytes.bind(address);

    // try types string and bytes32 for symbol
    let symbolValue = UNKNOWN_TOKEN_VALUE;
    let symbolResult = contract.try_symbol();
    if (!symbolResult.reverted) {
        return symbolResult.value;
    }

    // non-standard ERC20 implementation
    let symbolResultBytes = contractSymbolBytes.try_symbol();
    if (!symbolResultBytes.reverted) {
        // for broken pairs that have no symbol function exposed
        if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
            symbolValue = symbolResultBytes.value.toString();
        }
    }

    return symbolValue;
}
