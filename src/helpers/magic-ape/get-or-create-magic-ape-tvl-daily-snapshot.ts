import { ethereum } from "@graphprotocol/graph-ts";
import { MagicApeTvlDailySnapshot } from "../../../generated/schema";
import { SECONDS_PER_DAY, BIGDECIMAL_ZERO } from "../../constants";
import { getOrCreateMagicApe } from "./get-or-create-magic-ape";

export function getOrCreateMagicApeTvlDailySnapshot(block: ethereum.Block): MagicApeTvlDailySnapshot{
    const id: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;

    let dailySnapshot = MagicApeTvlDailySnapshot.load(id.toString());

    if(dailySnapshot) return dailySnapshot;

    const magicApe = getOrCreateMagicApe();

    dailySnapshot = new MagicApeTvlDailySnapshot(id.toString());
    dailySnapshot.magicApe = magicApe.id;
    dailySnapshot.totalValueLockedUsd = BIGDECIMAL_ZERO;
    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;

    return dailySnapshot;
}