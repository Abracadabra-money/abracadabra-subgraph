import { Address, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { SendToChain } from '../../generated/Beam/LzIndirectOFTV2';
import { newMockEvent } from 'matchstick-as/assembly';
import { BIGINT_ZERO, ZERO_ADDRESS } from 'misc';
import { BigInt } from '@graphprotocol/graph-ts';

export function createSendToChain(chainId: i32, amount: BigInt): SendToChain {
    const log: SendToChain = changetype<SendToChain>(newMockEvent());

    log.block.number = BIGINT_ZERO;
    log.block.timestamp = BIGINT_ZERO;
    log.address = Address.fromString(ZERO_ADDRESS);

    log.parameters = new Array();
    log.parameters.push(new ethereum.EventParam('_dstChainId', ethereum.Value.fromI32(chainId)));
    log.parameters.push(new ethereum.EventParam('_from', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    log.parameters.push(new ethereum.EventParam('_toAddress', ethereum.Value.fromBytes(Address.fromString(ZERO_ADDRESS))));
    log.parameters.push(new ethereum.EventParam('_amount', ethereum.Value.fromUnsignedBigInt(amount)));

    return log;
}
