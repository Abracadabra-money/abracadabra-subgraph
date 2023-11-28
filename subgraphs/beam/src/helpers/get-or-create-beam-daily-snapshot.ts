import { ethereum } from '@graphprotocol/graph-ts';
import { BeamDailySnapshot } from '../../generated/schema';
import { SECONDS_PER_DAY, BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';
import { getOrCreateBeam } from './get-or-create-beam';

export function getOrCreateBeamDailySnapshot(block: ethereum.Block): BeamDailySnapshot {
    const timestamp = block.timestamp.toI32();
    const hourIndex = timestamp / SECONDS_PER_DAY; // get unique hour within unix history
    const hourStartUnix = hourIndex * SECONDS_PER_DAY; // want the rounded effect

    let snapshot = BeamDailySnapshot.load(hourStartUnix.toString());

    if (snapshot) return snapshot;

    const beam = getOrCreateBeam();

    snapshot = new BeamDailySnapshot(hourStartUnix.toString());
    snapshot.timestamp = hourStartUnix;
    snapshot.beam = beam.id;
    snapshot.feesGenerated = BIGDECIMAL_ZERO;
    snapshot.feesGeneratedUsd = BIGDECIMAL_ZERO;
    snapshot.volume = BIGDECIMAL_ZERO;
    snapshot.sendCount = BIGINT_ZERO;
    snapshot.sendVolume = BIGDECIMAL_ZERO;
    snapshot.receiveCount = BIGINT_ZERO;
    snapshot.receiveVolume = BIGDECIMAL_ZERO;
    snapshot.save();

    return snapshot;
}
