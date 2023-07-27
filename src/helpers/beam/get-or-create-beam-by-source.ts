import { Address, dataSource } from '@graphprotocol/graph-ts';
import { getOrCreateBeam } from '.';
import { BeamBySource } from '../../../generated/schema';
import { BEAM_OFT, BIGINT_ZERO } from '../../constants';

export function getOrCreateBeamBySource(source: Address): BeamBySource {
    const id = `${BEAM_OFT.get(dataSource.network()).toHexString()}-${source.toHexString()}`;

    let beamBySource = BeamBySource.load(id);
    if (beamBySource) return beamBySource;

    const beam = getOrCreateBeam();

    beamBySource = new BeamBySource(id);
    beamBySource.beam = beam.id;
    beamBySource.txCount = BIGINT_ZERO;
    beamBySource.txVolume = BIGINT_ZERO;
    beamBySource.save();

    return beamBySource;
}
