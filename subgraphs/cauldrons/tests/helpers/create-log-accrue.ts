import { LogAccrue } from '../../generated/templates/Cauldron/Cauldron';
import { newMockEvent } from 'matchstick-as/assembly';
import { BLOCK_NUMBER, BLOCK_TIMESTAMP, CLONE_ADDRESS } from '../constants';
import { ethereum } from '@graphprotocol/graph-ts';
import { BigInt } from '@graphprotocol/graph-ts';

export function createLogAccrue(amount: BigInt): LogAccrue {
    const logAccrueEvent: LogAccrue = changetype<LogAccrue>(newMockEvent());

    logAccrueEvent.block.number = BLOCK_NUMBER;
    logAccrueEvent.block.timestamp = BLOCK_TIMESTAMP;
    logAccrueEvent.address = CLONE_ADDRESS;

    logAccrueEvent.parameters = new Array();

    logAccrueEvent.parameters.push(new ethereum.EventParam('accruedAmount', ethereum.Value.fromUnsignedBigInt(amount)));

    return logAccrueEvent;
}
