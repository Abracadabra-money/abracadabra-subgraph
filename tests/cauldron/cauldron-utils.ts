import { ethereum, BigInt, Address } from '@graphprotocol/graph-ts';
import { newMockCall, newMockEvent } from 'matchstick-as';
import { LiquidateCall, CookCall, BorrowCall, LogAccrue } from '../../generated/templates/Cauldron/Cauldron';
import { ABRA_DEPLOYERS, ACTION_BORROW } from '../../src/constants';
import { BLOCK_NUMBER, BLOCK_TIMESTAMP, CLONE_ADDRESS, MOCK_ACCOUNT, MOCK_COOK_BORROW } from '../constants';

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

export function createBorrowCookCall(): CookCall {
    const call: CookCall = changetype<CookCall>(newMockCall());
    call.to = CLONE_ADDRESS;
    call.inputValues = [
        new ethereum.EventParam('actions', ethereum.Value.fromArray([ethereum.Value.fromI32(ACTION_BORROW)])),
        new ethereum.EventParam('values', ethereum.Value.fromArray([ethereum.Value.fromI32(0)])),
        new ethereum.EventParam('datas', ethereum.Value.fromArray([ethereum.Value.fromBytes(MOCK_COOK_BORROW)])),
    ];
    return call;
}

export function createBorrowCall(): BorrowCall {
    const call: BorrowCall = changetype<BorrowCall>(newMockCall());
    call.to = CLONE_ADDRESS;
    call.inputValues = [new ethereum.EventParam('to', ethereum.Value.fromAddress(MOCK_ACCOUNT)), new ethereum.EventParam('amount', ethereum.Value.fromI32(1000000))];
    return call;
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
