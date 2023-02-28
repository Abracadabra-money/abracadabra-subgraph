import { ethereum } from "@graphprotocol/graph-ts";
import { BIGDECIMAL_ZERO, SECONDS_PER_DAY } from "../constants";
import { DailySnapshot } from "../../generated/schema";
import { getOrCreateProtocol } from "./get-or-create-protocol";

export function getOrCreateDailySnapshot(block: ethereum.Block): DailySnapshot {
    const id: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;

    let dailySnapshot = DailySnapshot.load(id.toString());

    if(dailySnapshot) return dailySnapshot;

    const protocol = getOrCreateProtocol();

    dailySnapshot = new DailySnapshot(id.toString());
    dailySnapshot.protocol = protocol.id;
    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;
    dailySnapshot.totalValueLockedUsd = protocol.totalValueLockedUsd;
    dailySnapshot.totalFeesGenerated = protocol.totalFeesGenerated;
    dailySnapshot.totalLiquidationsCount = protocol.totalLiquidationsCount;
    dailySnapshot.feesGenerated = BIGDECIMAL_ZERO;
    dailySnapshot.newLoansOpened = 0;
    dailySnapshot.liquidationsCount = 0;

    return dailySnapshot;
}