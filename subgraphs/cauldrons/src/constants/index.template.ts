import { BigInt } from '@graphprotocol/graph-ts';

export * from './types';
export * from './cauldron-borrow-parameters';

export const ABRA_DEPLOYERS = '{{cauldrons.deployers}}'.toLowerCase().split(',');

export const PROTOCOL_ID = '{{cauldrons.protocolId}}';
export const MIM_ADDRESS = '{{cauldrons.mimAddress}}';

// Ethereum Addresses
export const USD_BTC_ETH_ABRA_ADDRESS = '0x5958a8db7dfe0cc49382209069b00f54e17929c2';

// Cauldron
export const LIQUIDATION_MULTIPLIER_PRECISION = BigInt.fromI32(100000);
export const BORROW_OPENING_FEE_PRECISION = BigInt.fromI32(100000);
export const COLLATERIZATION_RATE_PRECISION = BigInt.fromI32(100000);
export const DISTRIBUTION_PART = BigInt.fromI32(10);
export const DISTRIBUTION_PRECISION = BigInt.fromI32(100);
