import { ethereum } from '@graphprotocol/graph-ts';
import { afterAll, beforeAll, clearStore, createMockedFunction, describe, newMockCall, test } from 'matchstick-as';
import { createCauldron } from '../../src/helpers/cauldron/create-cauldron';
import {
    CLONE_ADDRESS,
    BLOCK_NUMBER,
    BLOCK_TIMESTAMP,
    DATA,
    COLLATERAL_ADDRESS,
    COLLATERAL_DECIMALS,
    COLLATERAL_NAME,
    COLLATERAL_SYMBOL,
    MOCK_ACCOUNT,
    MOCK_COOK_BORROW,
} from '../constants';
import { handleBorrowCall, handleCookCall } from '../../src/mappings/cauldron';
import { BorrowCall, CookCall } from '../../generated/templates/Cauldron/Cauldron';
import { ACTION_BORROW } from '../../src/constants';

describe('Mock contract functions', () => {
    beforeAll(() => {
        // Create cauldron mock functions
        createMockedFunction(CLONE_ADDRESS, 'BORROW_OPENING_FEE', 'BORROW_OPENING_FEE():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(0)]);
        // Create collateral mock functions
        createMockedFunction(COLLATERAL_ADDRESS, 'symbol', 'symbol():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_SYMBOL)]);
        createMockedFunction(COLLATERAL_ADDRESS, 'name', 'name():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_NAME)]);
        createMockedFunction(COLLATERAL_ADDRESS, 'decimals', 'decimals():(uint8)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(COLLATERAL_DECIMALS)]);

        createCauldron(CLONE_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, DATA);
    });

    afterAll(() => {
        clearStore();
    });

    test('Can get fee from borrow call', () => {
        const call: BorrowCall = changetype<BorrowCall>(newMockCall());
        call.to = CLONE_ADDRESS;
        call.inputValues = [new ethereum.EventParam('to', ethereum.Value.fromAddress(MOCK_ACCOUNT)), new ethereum.EventParam('amount', ethereum.Value.fromI32(1000000))];

        handleBorrowCall(call);
    });

    test('Can get fee from cook call', () => {
        const call: CookCall = changetype<CookCall>(newMockCall());
        call.to = CLONE_ADDRESS;
        call.inputValues = [
            new ethereum.EventParam('actions', ethereum.Value.fromArray([ethereum.Value.fromI32(ACTION_BORROW)])),
            new ethereum.EventParam('values', ethereum.Value.fromArray([ethereum.Value.fromI32(0)])),
            new ethereum.EventParam('datas', ethereum.Value.fromArray([ethereum.Value.fromBytes(MOCK_COOK_BORROW)])),
        ];

        handleCookCall(call);
    });
});
