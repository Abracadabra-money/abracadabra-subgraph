import { BigInt } from '@graphprotocol/graph-ts';

export * from './types';
export * from './cauldron-borrow-parameters';

export const ABRA_DEPLOYERS = [
    // same on all chains
    '0xfddfe525054efaad204600d00ca86adb1cc2ea8a'.toLowerCase(),
    '0xb4EfdA6DAf5ef75D08869A0f9C0213278fb43b6C'.toLowerCase(),
    '0xfB3485c2e209A5cfBDC1447674256578f1A80eE3'.toLowerCase(),
];

export const BENTOBOX_ADDRESS = '{{cauldrons.bentoBox.address}}';
export const DEGENBOX_ADDRESS = '{{cauldrons.degenBox.address}}';
export const MIM_ADDRESS = '{{cauldrons.mimAddress}}';

// Ethereum Addresses
export const USD_BTC_ETH_ABRA_ADDRESS = '0x5958a8db7dfe0cc49382209069b00f54e17929c2';

// Cauldron
export const LIQUIDATION_MULTIPLIER_PRECISION = BigInt.fromI32(100000);
export const BORROW_OPENING_FEE_PRECISION = BigInt.fromI32(100000);
export const COLLATERIZATION_RATE_PRECISION = BigInt.fromI32(100000);
export const DISTRIBUTION_PART = BigInt.fromI32(10);
export const DISTRIBUTION_PRECISION = BigInt.fromI32(100);
