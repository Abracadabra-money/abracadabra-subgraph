import { ethereum } from '@graphprotocol/graph-ts';
import { SECONDS_PER_HOUR, BIGDECIMAL_ZERO, BIGINT_ZERO, BIGINT_ONE } from 'misc';
import { Cauldron, CauldronHourySnapshot } from '../../../generated/schema';

export function getOrCreateCauldronHourySnapshot(cauldron: Cauldron, block: ethereum.Block): CauldronHourySnapshot {
    const timestamp = block.timestamp.toI32();
    const hourIndex = timestamp / SECONDS_PER_HOUR; // get unique hour within unix history
    const hourStartUnix = hourIndex * SECONDS_PER_HOUR; // want the rounded effect

    const id = cauldron.id.concat('-').concat(hourStartUnix.toString());

    let snapshot = CauldronHourySnapshot.load(id.toString());

    if (snapshot) return snapshot;

    snapshot = new CauldronHourySnapshot(id.toString());
    snapshot.timestamp = hourStartUnix;
    snapshot.cauldron = cauldron.id;
    snapshot.cumulativeUniqueUsers = BIGINT_ZERO;
    snapshot.liquidationCount = BIGINT_ZERO;
    snapshot.totalValueLockedUsd = cauldron.totalValueLockedUsd;
    snapshot.totalMimBorrowed = cauldron.totalMimBorrowed;
    snapshot.feesGenerated = BIGDECIMAL_ZERO;
    snapshot.borrowFeesGenerated = BIGDECIMAL_ZERO;
    snapshot.interestFeesGenerated = BIGDECIMAL_ZERO;
    snapshot.liquidationFeesGenerated = BIGDECIMAL_ZERO;
    snapshot.liquidationAmountUsd = BIGDECIMAL_ZERO;
    snapshot.repaidAmount = BIGDECIMAL_ZERO;
    snapshot.totalCollateralShare = cauldron.totalCollateralShare;

    cauldron.hourySnapshotCount = cauldron.hourySnapshotCount.plus(BIGINT_ONE);
    cauldron.save();

    return snapshot;
}
