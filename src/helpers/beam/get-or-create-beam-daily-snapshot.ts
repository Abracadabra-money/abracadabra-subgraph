import { dataSource, ethereum } from '@graphprotocol/graph-ts';
import { getOrCreateBeam } from '.';
import { BeamDailySnapshot } from '../../../generated/schema';
import { BEAM_OFT, BIGINT_ZERO, SECONDS_PER_DAY } from '../../constants';

export function getOrCreateBeamDailySnapshot(block: ethereum.Block): BeamDailySnapshot {
    const epochDay: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;
    const id = `${BEAM_OFT.get(dataSource.network()).toHexString()}-${epochDay}`;

    let beamDailySnapshot = BeamDailySnapshot.load(id);
    if (beamDailySnapshot) return beamDailySnapshot;

    const beam = getOrCreateBeam();

    beamDailySnapshot = new BeamDailySnapshot(id);
    beamDailySnapshot.beam = beam.id;
    beamDailySnapshot.timestamp = block.timestamp;
    beamDailySnapshot.txCount = BIGINT_ZERO;
    beamDailySnapshot.txVolume = BIGINT_ZERO;
    beamDailySnapshot.rxCount = BIGINT_ZERO;
    beamDailySnapshot.rxVolume = BIGINT_ZERO;
    beamDailySnapshot.save();

    return beamDailySnapshot;
}
