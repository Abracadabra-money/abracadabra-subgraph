import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";

// Specific
export const MIM_MAINNET =
  "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3".toLowerCase();
export const MIM_AVALANCHE =
  "0x130966628846bfd36ff31a822705796e8cb8c18d".toLowerCase();
export const MIM_ARBITRUM =
  "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a".toLowerCase();
export const MIM_FANTOM =
  "0x82f0b8b456c1a451378467398982d4834b6829c1".toLowerCase();
export const MIM_BSC =
  "0xfe19f0b51438fd612f6fd59c1dbb3ea319f433ba".toLowerCase();

export const ABRA_DEPLOYERS = [
    // same on all chains
    "0xfddfe525054efaad204600d00ca86adb1cc2ea8a".toLowerCase(),
    "0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C".toLowerCase(),
    "0xfB3485c2e209A5cfBDC1447674256578f1A80eE3".toLowerCase(),
];

// Token
export const INVALID_TOKEN_DECIMALS = 0;
export const UNKNOWN_TOKEN_VALUE = "unknown";

// Type Helpers
export const DEFAULT_DECIMALS = 18;

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);

export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export const BIGDECIMAL_ONE = new BigDecimal(BIGINT_ONE);

// Ethereum Addresses
export const USD_BTC_ETH_ABRA_ADDRESS = "0x5958a8db7dfe0cc49382209069b00f54e17929c2";

// Networks
export const ETH_NETWORK = "mainnet";
export const FTM_NETWORK = "fantom";
export const ARB_NETWORK = "arbitrum-one";
export const BSC_NETWORK = "bsc";
export const AVALANCHE_NETWORK = "avalanche";