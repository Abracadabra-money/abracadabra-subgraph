import { assert, describe, test, clearStore, afterAll, createMockedFunction } from 'matchstick-as/assembly/index';
import { handleLogDeploy } from '../../src/mappings/core';
import { createLogDeployEvent } from './core-utils';
import {
    MASTER_CONTRACT_ADDRESS,
    DATA,
    CLONE_ADDRESS,
    COLLATERAL_ADDRESS,
    COLLATERAL_DECIMALS,
    COLLATERAL_NAME,
    COLLATERAL_SYMBOL,
    CAULDRON_ENTITY_TYPE,
    PROTOCOL_ENTITY_TYPE,
    COLLATERAL_ENTITY_TYPE,
} from '../constants';
import { Bytes, ethereum } from '@graphprotocol/graph-ts';
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from '../../src/constants';
import { getOrCreateProtocol } from '../../src/helpers/protocol';
import { getOrCreateCollateral } from '../../src/helpers/get-or-create-collateral';
import { getCauldron } from '../../src/helpers/cauldron';

describe('Mocked Events', () => {
    afterAll(() => {
        clearStore();
    });

    test('LogDeploy', () => {
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

        // Created protocol
        assert.entityCount(PROTOCOL_ENTITY_TYPE, 1);
        const protocolId = getOrCreateProtocol().id;
        assert.fieldEquals(PROTOCOL_ENTITY_TYPE, protocolId, 'totalValueLockedUsd', BIGDECIMAL_ZERO.toString());
        assert.fieldEquals(PROTOCOL_ENTITY_TYPE, protocolId, 'totalFeesGenerated', BIGDECIMAL_ZERO.toString());
        assert.fieldEquals(PROTOCOL_ENTITY_TYPE, protocolId, 'totalCauldronCount', '1');
        assert.fieldEquals(PROTOCOL_ENTITY_TYPE, protocolId, 'cumulativeUniqueUsers', '0');
        assert.fieldEquals(PROTOCOL_ENTITY_TYPE, protocolId, 'liquidationCount', '0');

        // Created Collateral
        const collateralId = getOrCreateCollateral(COLLATERAL_ADDRESS).id;
        assert.entityCount(COLLATERAL_ENTITY_TYPE, 1);
        assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'symbol', COLLATERAL_SYMBOL);
        assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'name', COLLATERAL_NAME);
        assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'decimals', COLLATERAL_DECIMALS.toString());
        assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'lastPriceUsd', BIGDECIMAL_ZERO.toString());
        assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'lastPriceBlockNumber', BIGINT_ZERO.toString());

        // Created Cauldron
        const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
        assert.entityCount(CAULDRON_ENTITY_TYPE, 1);
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'collateral', collateralId);
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'name', COLLATERAL_SYMBOL);
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'createdTimestamp', newLogDeployEvent.block.timestamp.toString());
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'createdBlockNumber', newLogDeployEvent.block.number.toString());
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'collateralPriceUsd', '0');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'exchangeRate', '0');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'protocol', protocolId);
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'isActive', 'false');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'deprecated', 'false');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'lastActive', newLogDeployEvent.block.timestamp.toString());
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'totalFeesGenerated', '0');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'borrowOpeningFee', '500');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'collaterizationRate', '80000');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'interestPerSecond', '158440439');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'liquidationMultiplier', '110000');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'oracle', '0x75e14253de6a5c2af12d5f1a1ea0a2e11e69ec10');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'cumulativeUniqueUsers', '0');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'oracleData', '0x00');
        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'liquidationCount', '0');
    });
});
