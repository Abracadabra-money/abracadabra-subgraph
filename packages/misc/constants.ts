import { BigInt, BigDecimal } from '@graphprotocol/graph-ts';

// Addresses
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// Token
export const INVALID_TOKEN_DECIMALS = 0;
export const UNKNOWN_TOKEN_VALUE = 'unknown';

// Type Helpers
export const DEFAULT_DECIMALS = 18;

export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGINT_ONE_HUNDRED = BigInt.fromI32(100);

export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export const BIGDECIMAL_ONE = new BigDecimal(BIGINT_ONE);
export const BIGDECIMAL_ONE_HUNDRED = new BigDecimal(BIGINT_ONE_HUNDRED);