import { ethereum } from '@graphprotocol/graph-ts';
import { BeamHourySnapshot } from '../../generated/schema';
import { SECONDS_PER_HOUR, BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';
import { getOrCreateBeam } from './get-or-create-beam';

export function getOrCreateBeamHourySnapshot(block: ethereum.Block): BeamHourySnapshot{
    const timestamp = block.timestamp.toI32();
    const hourIndex = timestamp / SECONDS_PER_HOUR; // get unique hour within unix history
    const hourStartUnix = hourIndex * SECONDS_PER_HOUR; // want the rounded effect

    let snapshot = BeamHourySnapshot.load(hourStartUnix.toString());

    if (snapshot) return snapshot;

    const beam = getOrCreateBeam();

    snapshot = new BeamHourySnapshot(hourStartUnix.toString());
    snapshot.timestamp = hourStartUnix;
    snapshot.beam = beam.id;
    snapshot.feesGenerated = BIGDECIMAL_ZERO;
    snapshot.volume = BIGDECIMAL_ZERO;
    snapshot.sendCount = BIGINT_ZERO;
    snapshot.sendVolume = BIGDECIMAL_ZERO;
    snapshot.receiveCount = BIGINT_ZERO;
    snapshot.receiveVolume = BIGDECIMAL_ZERO;
    snapshot.save();

    return snapshot;
}