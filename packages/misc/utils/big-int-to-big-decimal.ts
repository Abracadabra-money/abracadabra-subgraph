import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export function bigIntToBigDecimal(quantity: BigInt, decimals: i32 = 18): BigDecimal {
    return quantity.divDecimal(
        BigInt.fromI32(10)
            .pow(decimals as u8)
            .toBigDecimal(),
    );
}
