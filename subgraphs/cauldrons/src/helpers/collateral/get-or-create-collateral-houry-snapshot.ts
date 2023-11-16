import { ethereum } from "@graphprotocol/graph-ts";
import { Collateral, CollateralHourySnapshot } from '../../../generated/schema';
import { BIGDECIMAL_ZERO, SECONDS_PER_HOUR } from 'misc';

export function getOrCreateCollateralHourySnapshot(block: ethereum.Block, collateral: Collateral): CollateralHourySnapshot{
    const timestamp = block.timestamp.toI32();
    const hourIndex = timestamp / SECONDS_PER_HOUR; // get unique hour within unix history
    const hourStartUnix = hourIndex * SECONDS_PER_HOUR; // want the rounded effect

    const id = collateral.id.concat('-').concat(hourStartUnix.toString());

    let snapshot = CollateralHourySnapshot.load(id.toString());

    if (snapshot) return snapshot;

    snapshot = new CollateralHourySnapshot(id);
    snapshot.timestamp = hourStartUnix;
    snapshot.collateral = collateral.id;
    snapshot.lastPriceUsd = BIGDECIMAL_ZERO;

    return snapshot;
}