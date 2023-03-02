import { Address, BigDecimal, Bytes } from "@graphprotocol/graph-ts";
import { MAGIC_APE_ORACLE, DEFAULT_DECIMALS, BIGDECIMAL_ONE } from "../constants";
import { Oracle } from "../../generated/MagicApe/Oracle";
import { bigIntToBigDecimal } from "../utils";

export function getApePrice(): BigDecimal {
    const oracle = Oracle.bind(Address.fromString(MAGIC_APE_ORACLE));
    const rate = oracle.peekSpot(Bytes.fromHexString("0x"));
    return BIGDECIMAL_ONE.div(bigIntToBigDecimal(rate, DEFAULT_DECIMALS));
}