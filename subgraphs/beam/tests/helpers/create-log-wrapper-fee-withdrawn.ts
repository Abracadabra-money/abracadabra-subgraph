import { Address, ethereum } from '@graphprotocol/graph-ts';
import { LogWrapperFeeWithdrawn } from '../../generated/Wrapper/OFTWrapper';
import { newMockEvent } from 'matchstick-as/assembly';
import { BIGINT_ZERO, ZERO_ADDRESS } from 'misc';
import { BigInt } from '@graphprotocol/graph-ts';

export function createLogWrapperFeeWithdrawn(amount: BigInt): LogWrapperFeeWithdrawn {
    const log: LogWrapperFeeWithdrawn = changetype<LogWrapperFeeWithdrawn>(newMockEvent());

    log.block.number = BIGINT_ZERO;
    log.block.timestamp = BIGINT_ZERO;
    log.address = Address.fromString(ZERO_ADDRESS);

    log.parameters = new Array();
    log.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    log.parameters.push(new ethereum.EventParam('amount', ethereum.Value.fromUnsignedBigInt(amount)));

    return log;
}
