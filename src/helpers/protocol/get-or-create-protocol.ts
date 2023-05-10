import { dataSource } from '@graphprotocol/graph-ts';
import { Protocol } from '../../../generated/schema';
import { BIGDECIMAL_ZERO } from '../../constants';
import { getBentoBoxAddress } from '../get-bento-box-address';

export function getOrCreateProtocol(): Protocol {
    const protocolId = getBentoBoxAddress(dataSource.network());
    let protocol = Protocol.load(protocolId);
    if (protocol) return protocol;
    protocol = new Protocol(protocolId);

    protocol.totalValueLockedUsd = BIGDECIMAL_ZERO;
    protocol.totalFeesGenerated = BIGDECIMAL_ZERO;
    protocol.cauldronIds = [];
    protocol.totalCauldronCount = 0;
    protocol.cumulativeUniqueUsers = 0;
    protocol.liquidationCount = 0;
    protocol.liquidationAmountUsd = BIGDECIMAL_ZERO;
    protocol.repaidAmount = BIGDECIMAL_ZERO;
    protocol.totalMimBorrowed = BIGDECIMAL_ZERO;
    protocol.save();
    return protocol;
}
