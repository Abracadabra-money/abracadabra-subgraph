import { ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly';
import { LogBorrow } from '../../generated/templates/Cauldron/Cauldron';
import { BLOCK_NUMBER, BLOCK_TIMESTAMP, CLONE_ADDRESS, MOCK_ACCOUNT } from '../constants';

export function createLogBorrow(): LogBorrow {
    const logBorrowEvent: LogBorrow = changetype<LogBorrow>(newMockEvent());

    logBorrowEvent.block.number = BLOCK_NUMBER;
    logBorrowEvent.block.timestamp = BLOCK_TIMESTAMP;
    logBorrowEvent.address = CLONE_ADDRESS;

    logBorrowEvent.parameters = new Array();
    logBorrowEvent.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(MOCK_ACCOUNT)));
    logBorrowEvent.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(MOCK_ACCOUNT)));
    logBorrowEvent.parameters.push(new ethereum.EventParam('amount', ethereum.Value.fromI32(1005000)));
    logBorrowEvent.parameters.push(new ethereum.EventParam('part', ethereum.Value.fromI32(1000000)));

    return logBorrowEvent;
}
