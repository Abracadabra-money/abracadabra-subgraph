import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { BIGINT_18 } from "../constants";
import { exponentToBigDecimal } from './exponent-to-big-decimal'

export function convertEthToDecimal(eth: BigInt): BigDecimal {
    return eth.toBigDecimal().div(exponentToBigDecimal(BIGINT_18));
}