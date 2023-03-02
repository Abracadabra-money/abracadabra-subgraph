import { ethereum } from "@graphprotocol/graph-ts";
import { MagicApePriceDailySnapshot } from "../../../generated/schema";
import { SECONDS_PER_DAY, BIGDECIMAL_ONE } from "../../constants";
import { getOrCreateMagicApe } from "./get-or-create-magic-ape";

export function getOrCreateMagicApePriceDailySnapshot(block: ethereum.Block): MagicApePriceDailySnapshot {
    const id: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;

    let dailySnapshot = MagicApePriceDailySnapshot.load(id.toString());

    if(dailySnapshot) return dailySnapshot;

    const magicApe = getOrCreateMagicApe();

    dailySnapshot = new MagicApePriceDailySnapshot(id.toString());
    dailySnapshot.magicApe = magicApe.id;
    dailySnapshot.price = BIGDECIMAL_ONE;
    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;

    return dailySnapshot;
}