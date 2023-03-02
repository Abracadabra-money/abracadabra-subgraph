import { BigDecimal } from "@graphprotocol/graph-ts";

export function exponentBigNumber(x: BigDecimal, y: i32): BigDecimal {
    let result = x;
    for (let i = 0; i < y; i++) {
        result = result.times(x);
    }
    return result;
  }