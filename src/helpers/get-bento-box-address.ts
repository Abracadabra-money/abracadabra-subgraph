import { ETH_NETWORK, AVALANCHE_NETWORK, ARB_NETWORK, FTM_NETWORK, BSC_NETWORK, BENTOBOX_ADDRESS_ARBITRUM, BENTOBOX_ADDRESS_AVALANCHE, BENTOBOX_ADDRESS_BSC, BENTOBOX_ADDRESS_FANTOM, BENTOBOX_ADDRESS_MAINNET } from "../constants";

export function getBentoBoxAddress(network: string): string {
    if (network == ETH_NETWORK) {
      return BENTOBOX_ADDRESS_MAINNET;
    } else if (network == AVALANCHE_NETWORK) {
      return BENTOBOX_ADDRESS_AVALANCHE;
    } else if (network == ARB_NETWORK) {
      return BENTOBOX_ADDRESS_ARBITRUM;
    } else if (network == FTM_NETWORK) {
      return BENTOBOX_ADDRESS_FANTOM;
    } else if (network == BSC_NETWORK) {
      return BENTOBOX_ADDRESS_BSC;
    }
    return "";
}