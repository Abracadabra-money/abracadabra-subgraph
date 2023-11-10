import { Protocol } from '../../../generated/schema';
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';
import { PROTOCOL_ID } from '../../constants';

export function getOrCreateProtocol(): Protocol {
    let protocol = Protocol.load(PROTOCOL_ID);
    if (protocol) return protocol;
    protocol = new Protocol(PROTOCOL_ID);

    protocol.totalValueLockedUsd = BIGDECIMAL_ZERO;
    protocol.totalFeesGenerated = BIGDECIMAL_ZERO;
    protocol.cauldronIds = [];
    protocol.totalCauldronCount = BIGINT_ZERO;
    protocol.cumulativeUniqueUsers = BIGINT_ZERO;
    protocol.liquidationCount = BIGINT_ZERO;
    protocol.liquidationAmountUsd = BIGDECIMAL_ZERO;
    protocol.repaidAmount = BIGDECIMAL_ZERO;
    protocol.totalMimBorrowed = BIGDECIMAL_ZERO;
    protocol.borrowFeesGenerated = BIGDECIMAL_ZERO;
    protocol.interestFeesGenerated = BIGDECIMAL_ZERO;
    protocol.liquidationFeesGenerated = BIGDECIMAL_ZERO;
    protocol.dailySnapshotCount = BIGINT_ZERO;
    protocol.hourySnapshotCount = BIGINT_ZERO;
    protocol.save();
    return protocol;
}
