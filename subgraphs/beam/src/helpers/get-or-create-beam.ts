import { BEAM_ADDRESS } from '../constants';
import { Beam } from '../../generated/schema';
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';

export function getOrCreateBeam(): Beam{
    let beam = Beam.load(BEAM_ADDRESS);
    if(beam) return beam;

    beam = new Beam(BEAM_ADDRESS);
    beam.feesGenerated = BIGDECIMAL_ZERO;
    beam.volume = BIGDECIMAL_ZERO;
    beam.sendCount = BIGINT_ZERO;
    beam.sendVolume = BIGDECIMAL_ZERO;
    beam.receiveCount = BIGINT_ZERO;
    beam.receiveVolume = BIGDECIMAL_ZERO;
    beam.save();

    return beam;
}