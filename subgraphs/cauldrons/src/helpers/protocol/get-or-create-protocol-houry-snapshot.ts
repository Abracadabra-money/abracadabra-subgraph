import { ethereum } from '@graphprotocol/graph-ts';
import { SECONDS_PER_HOUR, BIGDECIMAL_ZERO, BIGINT_ZERO, BIGINT_ONE } from 'misc';
import { ProtocolHourySnapshot } from '../../../generated/schema';
import { getOrCreateProtocol } from './get-or-create-protocol';

export function getOrCreateProtocolHourySnapshot(block: ethereum.Block): ProtocolHourySnapshot {
    const timestamp = block.timestamp.toI32();
    const hourIndex = timestamp / SECONDS_PER_HOUR; // get unique hour within unix history
    const hourStartUnix = hourIndex * SECONDS_PER_HOUR; // want the rounded effect

    const protocol = getOrCreateProtocol();

    const id = protocol.id.concat('-').concat(hourStartUnix.toString());

    let snapshot = ProtocolHourySnapshot.load(id.toString());

    if (snapshot) return snapshot;

    snapshot = new ProtocolHourySnapshot(id.toString());
    snapshot.timestamp = hourStartUnix;
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

    protocol.hourySnapshotCount = protocol.hourySnapshotCount.plus(BIGINT_ONE);
    protocol.save();

    return snapshot;
}
