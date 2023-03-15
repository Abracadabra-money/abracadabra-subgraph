import { assert, describe, test, clearStore, afterAll, createMockedFunction } from 'matchstick-as/assembly/index';
import { handleLogDeploy } from '../../src/mappings/core';
import { createLogDeployEvent } from './core-utils';
import { MASTER_CONTRACT_ADDRESS, DATA, CLONE_ADDRESS, COLLATERAL_ADDRESS, COLLATERAL_DECIMALS, COLLATERAL_NAME, COLLATERAL_SYMBOL } from '../constants';
import { CAULDRON_ENTITY_TYPE, PROTOCOL_ENTITY_TYPE, COLLATERAL_ENTITY_TYPE } from '../constants';
import { Bytes, ethereum } from '@graphprotocol/graph-ts';

describe('Mocked Events', () => {
    afterAll(() => {
        clearStore();
    });

    test('LogDeploy created Cauldron', () => {
        const newLogDeployEvent = createLogDeployEvent(MASTER_CONTRACT_ADDRESS, DATA, CLONE_ADDRESS);
        // Create cauldron mock functions
        createMockedFunction(CLONE_ADDRESS, 'BORROW_OPENING_FEE', 'BORROW_OPENING_FEE():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(0)]);
        createMockedFunction(CLONE_ADDRESS, 'oracleData', 'oracleData():(bytes)')
            .withArgs([])
            .returns([ethereum.Value.fromBytes(Bytes.fromHexString('0x00'))]);
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
