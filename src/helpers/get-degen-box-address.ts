import {
    ETH_NETWORK,
    DEGENBOX_ADDRESS_MAINNET,
    AVALANCHE_NETWORK,
    DEGENBOX_ADDRESS_AVALANCHE,
    DEGENBOX_ADDRESS_OPTIMISM,
    ARB_NETWORK,
    DEGENBOX_ADDRESS_ARBITRUM,
    FTM_NETWORK,
    DEGENBOX_ADDRESS_FANTOM,
    BSC_NETWORK,
    DEGENBOX_ADDRESS_BSC,
    OPTIMISM_NETWORK,
} from '../constants';

export function getDegenBoxAddress(network: string): string {
    if (network == ETH_NETWORK) {
        return DEGENBOX_ADDRESS_MAINNET;
    } else if (network == AVALANCHE_NETWORK) {
        return DEGENBOX_ADDRESS_AVALANCHE;
    } else if (network == ARB_NETWORK) {
        return DEGENBOX_ADDRESS_ARBITRUM;
    } else if (network == FTM_NETWORK) {
        return DEGENBOX_ADDRESS_FANTOM;
    } else if (network == BSC_NETWORK) {
        return DEGENBOX_ADDRESS_BSC;
    } else if (network == OPTIMISM_NETWORK) {
        return DEGENBOX_ADDRESS_OPTIMISM;
    }
    return '';
}
