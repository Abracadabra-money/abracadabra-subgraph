import { Deposit, Withdraw } from "../../generated/MagicApe/MagicApe";
import { updateMagicApeTvl } from "../helpers/updates";
import { updateMagicApePrice } from "../helpers/updates/update-magic-ape-price";

export function handleLogDeposit(event: Deposit): void{
    updateMagicApeTvl(event.block);
    updateMagicApePrice(event.block);
}

export function handleLogWithdraw(event: Withdraw): void{
    updateMagicApeTvl(event.block);
    updateMagicApePrice(event.block);
}