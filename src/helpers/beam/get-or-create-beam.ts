import { dataSource } from '@graphprotocol/graph-ts';
import { Beam } from '../../../generated/schema';
import { BEAM_OFT, BIGINT_ZERO } from '../../constants';
import { getOrCreateProtocol } from '../protocol';

export function getOrCreateBeam(): Beam {
    const id = BEAM_OFT.get(dataSource.network()).toHexString();

    let beam = Beam.load(id);
    if (beam) return beam;

    const protocol = getOrCreateProtocol();

    beam = new Beam(id);
    beam.protocol = protocol.id;
    beam.txCount = BIGINT_ZERO;
    beam.txVolume = BIGINT_ZERO;
    beam.rxCount = BIGINT_ZERO;
    beam.rxVolume = BIGINT_ZERO;
    beam.save();

    return beam;
}
