import { dataSource } from '@graphprotocol/graph-ts';
import { getOrCreateBeam } from '.';
import { BeamByChain } from '../../../generated/schema';
import { BEAM_OFT, BIGINT_ZERO } from '../../constants';

export function getOrCreateBeamByChain(chainId: number): BeamByChain {
    const id = `${BEAM_OFT.get(dataSource.network()).toHexString()}-${chainId}`;

    let beamByChain = BeamByChain.load(id);
    if (beamByChain) return beamByChain;

    const beam = getOrCreateBeam();

    beamByChain = new BeamByChain(id);
    beamByChain.beam = beam.id;
    beamByChain.txCount = BIGINT_ZERO;
    beamByChain.txVolume = BIGINT_ZERO;
    beamByChain.rxCount = BIGINT_ZERO;
    beamByChain.rxVolume = BIGINT_ZERO;
    beamByChain.save();

    return beamByChain;
}
