import { assert, describe, test, clearStore, afterAll, createMockedFunction } from 'matchstick-as/assembly/index';
import { handleLogDeploy } from '../../src/mappings/core';
import { createLogDeployEvent } from './core-utils';
import {
    MASTER_CONTRACT_ADDRESS,
    DATA,
    CLONE_ADDRESS,
    COLLATERAL_ADDRESS,
    BORROW_OPENING_FEE,
    LIQUIDATION_MULTIPLIER,
    COLLATERIZATION_RATE,
    COLLATERAL_DECIMALS,
    COLLATERAL_NAME,
    COLLATERAL_SYMBOL,
    INTEREST_PER_SECOND,
    ORACLE_ADDRESS,
    ORACLE_DATA,
} from './constants';
import { CAULDRON_ENTITY_TYPE, PROTOCOL_ENTITY_TYPE, COLLATERAL_ENTITY_TYPE } from '../constants';
import { ethereum } from '@graphprotocol/graph-ts';

describe('Describe entity assertions', () => {
    afterAll(() => {
        clearStore();
    });

    test('LogDeploy created Cauldron', () => {
        const newLogDeployEvent = createLogDeployEvent(MASTER_CONTRACT_ADDRESS, DATA, CLONE_ADDRESS);
        // Create cauldron mock functions
        createMockedFunction(CLONE_ADDRESS, 'collateral', 'collateral():(address)')
            .withArgs([])
            .returns([ethereum.Value.fromAddress(COLLATERAL_ADDRESS)]);
        createMockedFunction(CLONE_ADDRESS, 'BORROW_OPENING_FEE', 'BORROW_OPENING_FEE():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(BORROW_OPENING_FEE)]);
        createMockedFunction(CLONE_ADDRESS, 'COLLATERIZATION_RATE', 'COLLATERIZATION_RATE():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(COLLATERIZATION_RATE)]);
        createMockedFunction(CLONE_ADDRESS, 'LIQUIDATION_MULTIPLIER', 'LIQUIDATION_MULTIPLIER():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(LIQUIDATION_MULTIPLIER)]);
        createMockedFunction(CLONE_ADDRESS, 'accrueInfo', 'accrueInfo():(uint64,uint128,uint64)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(0), ethereum.Value.fromI32(0), ethereum.Value.fromI32(INTEREST_PER_SECOND)]);
        createMockedFunction(CLONE_ADDRESS, 'accrueInfo', 'accrueInfo():(uint64,uint128,uint64)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(0), ethereum.Value.fromI32(0), ethereum.Value.fromI32(INTEREST_PER_SECOND)]);
        createMockedFunction(CLONE_ADDRESS, 'oracle', 'oracle():(address)')
            .withArgs([])
            .returns([ethereum.Value.fromAddress(ORACLE_ADDRESS)]);
        createMockedFunction(CLONE_ADDRESS, 'oracleData', 'oracleData():(bytes)')
            .withArgs([])
            .returns([ethereum.Value.fromBytes(ORACLE_DATA)]);
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

        handleLogDeploy(newLogDeployEvent);

        assert.entityCount(PROTOCOL_ENTITY_TYPE, 1);
        assert.entityCount(CAULDRON_ENTITY_TYPE, 1);
        assert.entityCount(COLLATERAL_ENTITY_TYPE, 1);
    });
});
