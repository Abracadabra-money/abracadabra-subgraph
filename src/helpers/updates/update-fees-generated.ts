import { BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Cauldron } from "../../../generated/schema";
import { getOrCreateDailySnapshot } from "../get-or-create-daily-snapshot";
import { getOrCreateProtocol } from "../get-or-create-protocol";

export function updateFeesGenerated(cauldron: Cauldron, amount: BigDecimal, block: ethereum.Block): void {
    const dailySnapshot = getOrCreateDailySnapshot(block);
    const protocol = getOrCreateProtocol();
    
    cauldron.totalFeesGenerated = cauldron.totalFeesGenerated.plus(amount);
    cauldron.save();

    dailySnapshot.feesGenerated = dailySnapshot.feesGenerated.plus(amount);
    dailySnapshot.save();

    protocol.totalFeesGenerated = protocol.totalFeesGenerated.plus(amount);
    protocol.save();
}