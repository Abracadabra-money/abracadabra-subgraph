import { Bytes, ethereum } from '@graphprotocol/graph-ts';
import { afterEach, assert, clearStore, createMockedFunction, describe, test } from 'matchstick-as/assembly/index';
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from '../../src/constants';
import { getCauldron } from '../../src/helpers/cauldron';
import { getOrCreateCollateral } from '../../src/helpers/get-or-create-collateral';
import { getOrCreateProtocol } from '../../src/helpers/protocol';
import { handleLogDeploy } from '../../src/mappings/core';
import {
    CAULDRON_ENTITY_TYPE,
    CAULDRON_V1_COLLATERAL_ADDRESS,
    CAULDRON_V1_DATA,
    CAULDRON_V1_MASTER_CONTRACT_ADDRESS,
    CLONE_ADDRESS,
    COLLATERAL_DECIMALS,
    COLLATERAL_ENTITY_TYPE,
    COLLATERAL_NAME,
    COLLATERAL_SYMBOL,
    NON_CAULDRON_V1_COLLATERAL_ADDRESS,
    NON_CAULDRON_V1_DATA,
    NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS,
    PROTOCOL_ENTITY_TYPE,
} from '../constants';
import { createLogDeployEvent } from './core-utils';

describe('handleLogDeploy()', () => {
    afterEach(() => {
        clearStore();
    });

    describe('When master contract is not a CauldronV1', () => {
        test('it creates a new cauldron', () => {
            const newLogDeployEvent = createLogDeployEvent(NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, NON_CAULDRON_V1_DATA, CLONE_ADDRESS);
            // Create cauldron mock functions
            createMockedFunction(CLONE_ADDRESS, 'BORROW_OPENING_FEE', 'BORROW_OPENING_FEE():(uint256)')
                .withArgs([])
                .returns([ethereum.Value.fromI32(0)]);
            createMockedFunction(CLONE_ADDRESS, 'oracleData', 'oracleData():(bytes)')
                .withArgs([])
                .returns([ethereum.Value.fromBytes(Bytes.fromHexString('0x00'))]);
            // Create collateral mock functions
            createMockedFunction(NON_CAULDRON_V1_COLLATERAL_ADDRESS, 'symbol', 'symbol():(string)')
                .withArgs([])
                .returns([ethereum.Value.fromString(COLLATERAL_SYMBOL)]);
            createMockedFunction(NON_CAULDRON_V1_COLLATERAL_ADDRESS, 'name', 'name():(string)')
                .withArgs([])
                .returns([ethereum.Value.fromString(COLLATERAL_NAME)]);
            createMockedFunction(NON_CAULDRON_V1_COLLATERAL_ADDRESS, 'decimals', 'decimals():(uint8)')
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
            const collateralId = getOrCreateCollateral(NON_CAULDRON_V1_COLLATERAL_ADDRESS).id;
            assert.entityCount(COLLATERAL_ENTITY_TYPE, 1);
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'symbol', COLLATERAL_SYMBOL);
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'name', COLLATERAL_NAME);
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'decimals', COLLATERAL_DECIMALS.toString());
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'lastPriceUsd', BIGDECIMAL_ZERO.toString());
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'lastPriceBlockNumber', BIGINT_ZERO.toString());

            // Created Cauldron
            const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
            assert.entityCount(CAULDRON_ENTITY_TYPE, 1);
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'masterContract', NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS.toHexString());
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

    describe('When master contract is a CauldronV1', () => {
        test('it creates a new cauldron', () => {
            const newLogDeployEvent = createLogDeployEvent(CAULDRON_V1_MASTER_CONTRACT_ADDRESS, CAULDRON_V1_DATA, CLONE_ADDRESS);
            // Create cauldron mock functions
            createMockedFunction(CLONE_ADDRESS, 'BORROW_OPENING_FEE', 'BORROW_OPENING_FEE():(uint256)').withArgs([]).reverts();
            createMockedFunction(CLONE_ADDRESS, 'oracleData', 'oracleData():(bytes)')
                .withArgs([])
                .returns([ethereum.Value.fromBytes(Bytes.fromHexString('0x00'))]);
            // Create collateral mock functions
            createMockedFunction(CAULDRON_V1_COLLATERAL_ADDRESS, 'symbol', 'symbol():(string)')
                .withArgs([])
                .returns([ethereum.Value.fromString(COLLATERAL_SYMBOL)]);
            createMockedFunction(CAULDRON_V1_COLLATERAL_ADDRESS, 'name', 'name():(string)')
                .withArgs([])
                .returns([ethereum.Value.fromString(COLLATERAL_NAME)]);
            createMockedFunction(CAULDRON_V1_COLLATERAL_ADDRESS, 'decimals', 'decimals():(uint8)')
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
            const collateralId = getOrCreateCollateral(CAULDRON_V1_COLLATERAL_ADDRESS).id;
            assert.entityCount(COLLATERAL_ENTITY_TYPE, 1);
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'symbol', COLLATERAL_SYMBOL);
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'name', COLLATERAL_NAME);
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'decimals', COLLATERAL_DECIMALS.toString());
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'lastPriceUsd', BIGDECIMAL_ZERO.toString());
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateralId, 'lastPriceBlockNumber', BIGINT_ZERO.toString());

            // Created Cauldron
            const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
            assert.entityCount(CAULDRON_ENTITY_TYPE, 1);
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'masterContract', CAULDRON_V1_MASTER_CONTRACT_ADDRESS.toHexString());
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
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'borrowOpeningFee', '50');
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'collaterizationRate', '90000');
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'interestPerSecond', '253509908');
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'liquidationMultiplier', '103000');
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'oracle', '0x6cc0cd7d25e291029b55c767b9a2d1d9a18ae668');
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'cumulativeUniqueUsers', '0');
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'oracleData', '0x00');
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'liquidationCount', '0');
        });
    });
});