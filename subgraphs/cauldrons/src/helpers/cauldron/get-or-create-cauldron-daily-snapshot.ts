import { ethereum } from '@graphprotocol/graph-ts';
import { BIGDECIMAL_ZERO, SECONDS_PER_DAY } from 'misc';
import { Cauldron, CauldronDailySnapshot } from '../../../generated/schema';

export function getOrCreateCauldronDailySnapshot(cauldron: Cauldron, block: ethereum.Block): CauldronDailySnapshot {
    const timestamp = block.timestamp.toI32();
    const dayID = timestamp / SECONDS_PER_DAY;
    const dayStartTimestamp = dayID * SECONDS_PER_DAY;

    const id = cauldron.id.concat('-').concat(dayStartTimestamp.toString());

    let snapshot = CauldronDailySnapshot.load(id);

    if (snapshot) return snapshot;

    snapshot = new CauldronDailySnapshot(id);
    snapshot.timestamp = dayStartTimestamp;
    snapshot.cauldron = cauldron.id;
    snapshot.cumulativeUniqueUsers = 0;
    snapshot.liquidationCount = 0;
    snapshot.totalValueLockedUsd = cauldron.totalValueLockedUsd;
    snapshot.totalMimBorrowed = cauldron.totalMimBorrowed;
    snapshot.feesGenerated = BIGDECIMAL_ZERO;
    snapshot.borrowFeesGenerated = BIGDECIMAL_ZERO;
    snapshot.interestFeesGenerated = BIGDECIMAL_ZERO;
    snapshot.liquidationFeesGenerated = BIGDECIMAL_ZERO;
    snapshot.liquidationAmountUsd = BIGDECIMAL_ZERO;
    snapshot.repaidAmount = BIGDECIMAL_ZERO;
    snapshot.totalCollateralShare = cauldron.totalCollateralShare;

    return snapshot;
}
