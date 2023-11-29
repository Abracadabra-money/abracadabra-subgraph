import { ethereum } from '@graphprotocol/graph-ts';
import { BIGDECIMAL_ZERO, SECONDS_PER_DAY, BIGINT_ZERO, BIGINT_ONE } from 'misc';
import { ProtocolDailySnapshot } from '../../../generated/schema';
import { getOrCreateProtocol } from './get-or-create-protocol';

export function getOrCreateProtocolDailySnapshot(block: ethereum.Block): ProtocolDailySnapshot {
    const timestamp = block.timestamp.toI32();
    const dayID = timestamp / SECONDS_PER_DAY;
    const dayStartTimestamp = dayID * SECONDS_PER_DAY;

    const protocol = getOrCreateProtocol();

    const id = protocol.id.concat('-').concat(dayStartTimestamp.toString());

    let snapshot = ProtocolDailySnapshot.load(id);

    if (snapshot) return snapshot;

    snapshot = new ProtocolDailySnapshot(id.toString());
    snapshot.timestamp = dayStartTimestamp;
    snapshot.protocol = protocol.id;
    snapshot.cumulativeUniqueUsers = BIGINT_ZERO;
    snapshot.liquidationCount = BIGINT_ZERO;
    snapshot.totalValueLockedUsd = protocol.totalValueLockedUsd;
    snapshot.totalMimBorrowed = protocol.totalMimBorrowed;
    snapshot.feesGenerated = BIGDECIMAL_ZERO;
    snapshot.borrowFeesGenerated = BIGDECIMAL_ZERO;
    snapshot.interestFeesGenerated = BIGDECIMAL_ZERO;
    snapshot.liquidationFeesGenerated = BIGDECIMAL_ZERO;
    snapshot.liquidationAmountUsd = BIGDECIMAL_ZERO;
    snapshot.repaidAmount = BIGDECIMAL_ZERO;
    snapshot.totalFeesGenerated = protocol.totalFeesGenerated;

    protocol.dailySnapshotCount = protocol.dailySnapshotCount.plus(BIGINT_ONE);
    protocol.save();

    return snapshot;
}
