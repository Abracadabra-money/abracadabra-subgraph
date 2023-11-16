import { ethereum } from "@graphprotocol/graph-ts";
import { Collateral, CollateralDailySnapshot } from '../../../generated/schema';
import { BIGDECIMAL_ZERO, SECONDS_PER_DAY } from 'misc';

export function getOrCreateCollateralDailySnapshot(block: ethereum.Block, collateral: Collateral): CollateralDailySnapshot{
    const timestamp = block.timestamp.toI32();
    const dayID = timestamp / SECONDS_PER_DAY;
    const dayStartTimestamp = dayID * SECONDS_PER_DAY;

    const id = collateral.id.concat('-').concat(dayStartTimestamp.toString());

    let snapshot = CollateralDailySnapshot.load(id);

    if (snapshot) return snapshot;

    snapshot = new CollateralDailySnapshot(id);
    snapshot.timestamp = dayStartTimestamp;
    snapshot.collateral = collateral.id;
    snapshot.lastPriceUsd = BIGDECIMAL_ZERO;

    return snapshot;
}