import { ethereum } from "@graphprotocol/graph-ts";
import { Cauldron } from "../../../generated/schema";

export function updateLastActive(cauldron: Cauldron, block: ethereum.Block): void{
    cauldron.lastActive = block.timestamp;
    cauldron.isActive = true;
    cauldron.save();
}