import { ETH_NETWORK, MIM_MAINNET, AVALANCHE_NETWORK, MIM_AVALANCHE, ARB_NETWORK, MIM_ARBITRUM, FTM_NETWORK, MIM_FANTOM, BSC_NETWORK, MIM_BSC } from "../constants";

export function getMIMAddress(network: string): string {
    if (network == ETH_NETWORK) {
      return MIM_MAINNET;
    } else if (network == AVALANCHE_NETWORK) {
      return MIM_AVALANCHE;
    } else if (network == ARB_NETWORK) {
      return MIM_ARBITRUM;
    } else if (network == FTM_NETWORK) {
      return MIM_FANTOM;
    } else if (network == BSC_NETWORK) {
      return MIM_BSC;
    }
    return "";
}