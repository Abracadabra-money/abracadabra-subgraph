import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export function numberToBigDecimals(value: i32): BigDecimal {
    return new BigDecimal(BigInt.fromI32(value));
}
