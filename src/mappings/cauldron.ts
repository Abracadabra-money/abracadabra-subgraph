import { LogAccrue, LogBorrow, LogAddCollateral, LogRemoveCollateral, LogRepay, LogExchangeRate } from "../../generated/templates/Cauldron/Cauldron";
import { getCauldron } from "../helpers/cauldron";
import { getOrCreateCollateral } from "../helpers/get-or-create-collateral";
import { Address } from "@graphprotocol/graph-ts";
import { updateTokenPrice } from "../helpers/updates";

export function handleLogAddCollateral(event: LogAddCollateral): void {

}

export function handleLogRemoveCollateral(event: LogRemoveCollateral): void {

}

export function handleLogBorrow(event: LogBorrow): void {

}

export function handleLogRepay(event: LogRepay): void {

}

export function handleLogExchangeRate(event: LogExchangeRate): void {
    const cauldron = getCauldron(event.address.toHexString());
    if(!cauldron) return;
    const collateral = getOrCreateCollateral(Address.fromString(cauldron.collateral));

    cauldron.exchangeRate = event.params.rate;
    cauldron.save();

    updateTokenPrice(event.params.rate, collateral, cauldron, event.block);
}

export function handleLogAccrue(event: LogAccrue): void {
    
}