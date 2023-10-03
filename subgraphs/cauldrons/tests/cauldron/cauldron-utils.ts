import { ethereum, BigInt } from '@graphprotocol/graph-ts';
import { newMockCall, newMockEvent } from 'matchstick-as';
import { LiquidateCall, LogAccrue, LogBorrow } from '../../generated/templates/Cauldron/Cauldron';
import { BLOCK_NUMBER, BLOCK_TIMESTAMP, CLONE_ADDRESS, MOCK_ACCOUNT } from '../constants';

export function createLiquidateCall(): LiquidateCall {
    const call: LiquidateCall = changetype<LiquidateCall>(newMockCall());
    call.to = CLONE_ADDRESS;
    call.inputValues = [
        new ethereum.EventParam('users', ethereum.Value.fromArray([ethereum.Value.fromAddress(MOCK_ACCOUNT)])),
        new ethereum.EventParam('maxBorrowParts', ethereum.Value.fromArray([ethereum.Value.fromSignedBigInt(BigInt.fromString('1200700756276012022288'))])),
        new ethereum.EventParam('to', ethereum.Value.fromAddress(MOCK_ACCOUNT)),
    ];
    return call;
}

export function createLogBorrowEvent(): LogBorrow {
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

export function createLogAccrueEvent(): LogAccrue {
    const logAccrueEvent: LogAccrue = changetype<LogAccrue>(newMockEvent());

    logAccrueEvent.block.number = BLOCK_NUMBER;
    logAccrueEvent.block.timestamp = BLOCK_TIMESTAMP;
    logAccrueEvent.address = CLONE_ADDRESS;

    logAccrueEvent.parameters = new Array();

    logAccrueEvent.parameters.push(new ethereum.EventParam('accruedAmount', ethereum.Value.fromI32(1000000)));

    return logAccrueEvent;
}
