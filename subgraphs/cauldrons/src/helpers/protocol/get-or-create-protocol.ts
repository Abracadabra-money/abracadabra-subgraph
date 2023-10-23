import { Protocol } from '../../../generated/schema';
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';
import { BENTOBOX_ADDRESS, DEGENBOX_ADDRESS } from '../../constants';

export function getOrCreateProtocol(): Protocol {
    const protocolId = BENTOBOX_ADDRESS || DEGENBOX_ADDRESS;
    let protocol = Protocol.load(protocolId);
    if (protocol) return protocol;
    protocol = new Protocol(protocolId);

    protocol.totalValueLockedUsd = BIGDECIMAL_ZERO;
    protocol.totalFeesGenerated = BIGDECIMAL_ZERO;
    protocol.cauldronIds = [];
    protocol.totalCauldronCount = BIGINT_ZERO;
    protocol.cumulativeUniqueUsers = BIGINT_ZERO;
    protocol.liquidationCount = BIGINT_ZERO;
    protocol.liquidationAmountUsd = BIGDECIMAL_ZERO;
    protocol.repaidAmount = BIGDECIMAL_ZERO;
    protocol.totalMimBorrowed = BIGDECIMAL_ZERO;
    protocol.save();
    return protocol;
}
