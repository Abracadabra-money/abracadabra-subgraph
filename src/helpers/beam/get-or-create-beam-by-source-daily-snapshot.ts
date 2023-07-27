import { Address, dataSource, ethereum } from '@graphprotocol/graph-ts';
import { getOrCreateBeamBySource } from '.';
import { BeamBySourceDailySnapshot } from '../../../generated/schema';
import { BEAM_OFT, BIGINT_ZERO, SECONDS_PER_DAY } from '../../constants';

export function getOrCreateBeamBySourceDailySnapshot(source: Address, block: ethereum.Block): BeamBySourceDailySnapshot {
    const epochDay: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;
    const id = `${BEAM_OFT.get(dataSource.network()).toHexString()}-${source.toHexString()}-${epochDay}`;

    let beamBySourceDailySnapshot = BeamBySourceDailySnapshot.load(id);
    if (beamBySourceDailySnapshot) return beamBySourceDailySnapshot;

    const beamBySource = getOrCreateBeamBySource(source);

    beamBySourceDailySnapshot = new BeamBySourceDailySnapshot(id);
    beamBySourceDailySnapshot.beamBySource = beamBySource.id;
    beamBySourceDailySnapshot.timestamp = block.timestamp;
    beamBySourceDailySnapshot.txCount = BIGINT_ZERO;
    beamBySourceDailySnapshot.txVolume = BIGINT_ZERO;
    beamBySourceDailySnapshot.save();

    return beamBySourceDailySnapshot;
}
