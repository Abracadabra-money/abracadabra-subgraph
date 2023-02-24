import { LogDeploy } from "../../generated/DegenBox/DegenBox";
import { ABRA_DEPLOYERS } from "../constants";
import { Cauldron } from "../../generated/templates";
import { createCauldron } from "../helpers/create-cauldron";

export function handleLogDeploy(event: LogDeploy): void {
    const account = event.transaction.from.toHex().toLowerCase();
    if(ABRA_DEPLOYERS.includes(account)){
        createCauldron(event.params.cloneAddress, event.block.number, event.block.timestamp);
        Cauldron.create(event.params.cloneAddress);
    }
}