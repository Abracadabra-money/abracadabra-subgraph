import { BigInt, BigDecimal } from '@graphprotocol/graph-ts';

export namespace Network {
    export const ARBITRUM_ONE = 'ARBITRUM_ONE';
    export const AVALANCHE = 'AVALANCHE';
    export const AURORA = 'AURORA';
    export const BSC = 'BSC'; // aka BNB Chain
    export const CELO = 'CELO';
    export const MAINNET = 'MAINNET'; // Ethereum mainnet
    export const FANTOM = 'FANTOM';
    export const FUSE = 'FUSE';
    export const MOONBEAM = 'MOONBEAM';
    export const MOONRIVER = 'MOONRIVER';
    export const NEAR_MAINNET = 'NEAR_MAINNET';
    export const OPTIMISM = 'OPTIMISM';
    export const MATIC = 'MATIC'; // aka Polygon
    export const XDAI = 'XDAI'; // aka Gnosis Chain
}

// Ethereum Addresses
export const USD_BTC_ETH_ABRA_ADDRESS = '0x5958a8db7dfe0cc49382209069b00f54e17929c2';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// Specific
export const BENTOBOX_ADDRESS_MAINNET = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966'.toLowerCase();
export const BENTOBOX_ADDRESS_AVALANCHE = '0xf4F46382C2bE1603Dc817551Ff9A7b333Ed1D18f'.toLowerCase();
export const BENTOBOX_ADDRESS_ARBITRUM = '0x74c764D41B77DBbb4fe771daB1939B00b146894A'.toLowerCase();
export const BENTOBOX_ADDRESS_FANTOM = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966'.toLowerCase();
export const BENTOBOX_ADDRESS_BSC = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966'.toLowerCase();
export const BENTOBOX_ADDRESS_OPTIMISM = ZERO_ADDRESS;

export const DEGENBOX_ADDRESS_MAINNET = '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce'.toLowerCase();
export const DEGENBOX_ADDRESS_AVALANCHE = '0x1fC83f75499b7620d53757f0b01E2ae626aAE530'.toLowerCase();
export const DEGENBOX_ADDRESS_ARBITRUM = '0x7C8FeF8eA9b1fE46A7689bfb8149341C90431D38'.toLowerCase();
export const DEGENBOX_ADDRESS_FANTOM = '0x74A0BcA2eeEdf8883cb91E37e9ff49430f20a616'.toLowerCase();
export const DEGENBOX_ADDRESS_BSC = '0x090185f2135308BaD17527004364eBcC2D37e5F6'.toLowerCase();
export const DEGENBOX_ADDRESS_OPTIMISM = '0xa93C81f564579381116ee3E007C9fCFd2EBa1723'.toLowerCase();

export const MIM_MAINNET = '0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3'.toLowerCase();
export const MIM_AVALANCHE = '0x130966628846bfd36ff31a822705796e8cb8c18d'.toLowerCase();
export const MIM_ARBITRUM = '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A'.toLowerCase();
export const MIM_FANTOM = '0x82f0b8b456c1a451378467398982d4834b6829c1'.toLowerCase();
export const MIM_BSC = '0xfe19f0b51438fd612f6fd59c1dbb3ea319f433ba'.toLowerCase();
export const MIM_OPTIMISM = '0xB153FB3d196A8eB25522705560ac152eeEc57901'.toLowerCase();

export const ABRA_DEPLOYERS = [
    // same on all chains
    '0xfddfe525054efaad204600d00ca86adb1cc2ea8a'.toLowerCase(),
    '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C'.toLowerCase(),
    '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3'.toLowerCase(),
];

// MagicApe
export const MAGIC_APE_STAKING = '0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9'.toLowerCase();
export const MAGIC_APE = '0xf35b31B941D94B249EaDED041DB1b05b7097fEb6'.toLowerCase();
export const MAGIC_APE_ORACLE = '0x64422a1337082Bf99E6052fF52684374Eb1A7fB7'.toLowerCase();

// Token
export const INVALID_TOKEN_DECIMALS = 0;
export const UNKNOWN_TOKEN_VALUE = 'unknown';

// Type Helpers
export const DEFAULT_DECIMALS = 18;

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);

export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export const BIGDECIMAL_ONE = new BigDecimal(BIGINT_ONE);

// Networks
export const ETH_NETWORK = 'mainnet';
export const FTM_NETWORK = 'fantom';
export const ARB_NETWORK = 'arbitrum-one';
export const BSC_NETWORK = 'bsc';
export const AVALANCHE_NETWORK = 'avalanche';
export const OPTIMISM_NETWORK = 'optimism';

// Date/Time
export const SECONDS_PER_HOUR = 60 * 60; // 360
export const SECONDS_PER_DAY = 60 * 60 * 24; // 86400
export const SECONDS_PER_YEAR = new BigDecimal(BigInt.fromI32(60 * 60 * 24 * 365));
export const MS_PER_DAY = new BigDecimal(BigInt.fromI32(24 * 60 * 60 * 1000));
export const DAYS_PER_YEAR = new BigDecimal(BigInt.fromI32(365));
export const MS_PER_YEAR = DAYS_PER_YEAR.times(new BigDecimal(BigInt.fromI32(24 * 60 * 60 * 1000)));
