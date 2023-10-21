import { LogExchangeRate } from '../../generated/templates/Cauldron/Cauldron';
import { newMockEvent } from 'matchstick-as/assembly';
import { BLOCK_NUMBER, BLOCK_TIMESTAMP, CLONE_ADDRESS } from '../constants';
import { ethereum } from '@graphprotocol/graph-ts';
import { BigInt } from '@graphprotocol/graph-ts';

export function createLogExchangeRate(amount: BigInt): LogExchangeRate {
    const log: LogExchangeRate = changetype<LogExchangeRate>(newMockEvent());

    log.block.number = BLOCK_NUMBER;
    log.block.timestamp = BLOCK_TIMESTAMP;
    log.address = CLONE_ADDRESS;

    log.parameters = new Array();

    log.parameters.push(new ethereum.EventParam('rate', ethereum.Value.fromUnsignedBigInt(amount)));

    return log;
}
