import { BigInt } from "@graphprotocol/graph-ts";
import { BIGINT_ONE } from "../constants";

// n => 10^n
export function exponentToBigInt(decimals: i32): BigInt {
    let result = BIGINT_ONE;
    const ten = BigInt.fromI32(10);
    for (let i = 0; i < decimals; i++) {
      result = result.times(ten);
    }
    return result;
  }