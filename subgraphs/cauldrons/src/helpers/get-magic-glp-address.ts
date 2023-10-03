import { ARB_NETWORK, AVALANCHE_NETWORK, MAGIC_GLP_ARBITRUM, MAGIC_GLP_AVALANCHE } from '../constants';

export function getMagicGlpAddress(network: string): string {
    if (network == ARB_NETWORK) {
        return MAGIC_GLP_ARBITRUM;
    } else if (network == AVALANCHE_NETWORK) {
        return MAGIC_GLP_AVALANCHE;
    }
    return '';
}
