import { Address, ethereum } from '@graphprotocol/graph-ts';
import { ReceiveFromChain } from '../../generated/Beam/LzIndirectOFTV2';
import { newMockEvent } from 'matchstick-as/assembly';
import { BIGINT_ZERO, ZERO_ADDRESS } from 'misc';
import { BigInt } from '@graphprotocol/graph-ts';

export function createReceiveToChain(chainId: i32, amount: BigInt): ReceiveFromChain {
    const log: ReceiveFromChain = changetype<ReceiveFromChain>(newMockEvent());

    log.block.number = BIGINT_ZERO;
    log.block.timestamp = BIGINT_ZERO;
    log.address = Address.fromString(ZERO_ADDRESS);

    log.parameters = new Array();
    log.parameters.push(new ethereum.EventParam('_srcChainId', ethereum.Value.fromI32(chainId)));
    log.parameters.push(new ethereum.EventParam('_to', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    log.parameters.push(new ethereum.EventParam('_amount', ethereum.Value.fromUnsignedBigInt(amount)));

    return log;
}
