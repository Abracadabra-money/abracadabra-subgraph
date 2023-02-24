import { Address, dataSource } from "@graphprotocol/graph-ts";
import { Collateral } from "../../generated/schema";
import { getTokenSymbol } from "./get-token-symbol";
import { getTokenName } from "./get-token-name";
import { getTokenDecimals } from "./get-token-decimals";
import { DEFAULT_DECIMALS, USD_BTC_ETH_ABRA_ADDRESS, BIGINT_ZERO, BIGDECIMAL_ONE, BIGDECIMAL_ZERO } from "../constants";
import { getMIMAddress } from "./get-mim-address";

export function getOrCreateCollateral(address: Address): Collateral {
    let collateral = Collateral.load(address.toHexString());
    if(!collateral){
        collateral = new Collateral(address.toHexString());
        collateral.symbol = getTokenSymbol(address);
        collateral.name = getTokenName(address);
        if (address == Address.fromString(USD_BTC_ETH_ABRA_ADDRESS)) {
            collateral.decimals = DEFAULT_DECIMALS;
        } else {
            collateral.decimals = getTokenDecimals(address);
        }
      
        collateral.lastPriceUSD =
            address == Address.fromString(getMIMAddress(dataSource.network()))
              ? BIGDECIMAL_ONE
              : BIGDECIMAL_ZERO;
        collateral.lastPriceBlockNumber = BIGINT_ZERO;
        collateral.save();
    }
    return collateral;
}