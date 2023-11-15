import { Bytes, ethereum } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, createMockedFunction, describe, test } from 'matchstick-as/assembly/index';
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';
import { getCauldron } from '../src/helpers/cauldron';
import { getOrCreateCollateral } from '../src/helpers/collateral';
import { getOrCreateProtocol } from '../src/helpers/protocol';
import { handleLogDeploy } from '../src/mappings/core';
import {
    BENTO_BOX_ADDRESS,
    BENTO_BOX_ENTITY,
    CAULDRON_ENTITY,
    CAULDRON_V1_COLLATERAL_ADDRESS,
    CAULDRON_V1_DATA,
    CAULDRON_V1_MASTER_CONTRACT_ADDRESS,
    CLONE_ADDRESS,
    COLLATERAL_DECIMALS,
    COLLATERAL_ENTITY,
    COLLATERAL_NAME,
    COLLATERAL_SYMBOL,
    NON_CAULDRON_V1_COLLATERAL_ADDRESS,
    NON_CAULDRON_V1_DATA,
    NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS,
    PROTOCOL_ENTITY,
} from './constants';
import { createLogDeploy } from './helpers/create-log-deploy';

describe('handleLogDeploy()', () => {
    describe('When master contract is not a CauldronV1', () => {
        beforeEach(() => {
            clearStore();

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
        });

        test('should create protocol', () => {
            const newLogDeployEvent = createLogDeploy(NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, NON_CAULDRON_V1_DATA, CLONE_ADDRESS);

            handleLogDeploy(newLogDeployEvent);

            assert.entityCount(PROTOCOL_ENTITY, 1);
            const protocolId = getOrCreateProtocol().id;
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalValueLockedUsd', BIGDECIMAL_ZERO.toString());
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalFeesGenerated', BIGDECIMAL_ZERO.toString());
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalCauldronCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'cumulativeUniqueUsers', '0');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'liquidationCount', '0');
        });

        test('should create bentobox', () => {
            const newLogDeployEvent = createLogDeploy(NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, NON_CAULDRON_V1_DATA, CLONE_ADDRESS);

            handleLogDeploy(newLogDeployEvent);

            const protocolId = getOrCreateProtocol().id;

            assert.entityCount(BENTO_BOX_ENTITY, 1);
            const bentBoxId = BENTO_BOX_ADDRESS.toHexString();
            assert.fieldEquals(BENTO_BOX_ENTITY, bentBoxId, 'protocol', protocolId);
        });

        test('should create collateral', () => {
            const newLogDeployEvent = createLogDeploy(NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, NON_CAULDRON_V1_DATA, CLONE_ADDRESS);

            handleLogDeploy(newLogDeployEvent);

            // Created Collateral
            const collateralId = getOrCreateCollateral(NON_CAULDRON_V1_COLLATERAL_ADDRESS).id;
            assert.entityCount(COLLATERAL_ENTITY, 1);
            assert.fieldEquals(COLLATERAL_ENTITY, collateralId, 'symbol', COLLATERAL_SYMBOL);
            assert.fieldEquals(COLLATERAL_ENTITY, collateralId, 'name', COLLATERAL_NAME);
            assert.fieldEquals(COLLATERAL_ENTITY, collateralId, 'decimals', COLLATERAL_DECIMALS.toString());
            assert.fieldEquals(COLLATERAL_ENTITY, collateralId, 'lastPriceUsd', BIGDECIMAL_ZERO.toString());
            assert.fieldEquals(COLLATERAL_ENTITY, collateralId, 'lastPriceBlockNumber', BIGINT_ZERO.toString());
        });

        test('should create cauldron', () => {
            const newLogDeployEvent = createLogDeploy(NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, NON_CAULDRON_V1_DATA, CLONE_ADDRESS);

            handleLogDeploy(newLogDeployEvent);

            // Created Cauldron
            const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
            const collateralId = getOrCreateCollateral(NON_CAULDRON_V1_COLLATERAL_ADDRESS).id;
            const protocolId = getOrCreateProtocol().id;

            assert.entityCount(CAULDRON_ENTITY, 1);
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'masterContract', NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS.toHexString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'collateral', collateralId);
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'name', COLLATERAL_SYMBOL);
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'createdTimestamp', newLogDeployEvent.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'createdBlockNumber', newLogDeployEvent.block.number.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'collateralPriceUsd', '0');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'exchangeRate', '0');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'protocol', protocolId);
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'isActive', 'false');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'deprecated', 'false');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'lastActive', newLogDeployEvent.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'totalFeesGenerated', '0');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'borrowOpeningFee', '500');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'collaterizationRate', '80000');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'interestPerSecond', '158440439');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'liquidationMultiplier', '110000');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'oracle', '0x75e14253de6a5c2af12d5f1a1ea0a2e11e69ec10');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'cumulativeUniqueUsers', '0');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'oracleData', '0x00');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'liquidationCount', '0');
        });
    });

    describe('When master contract is a CauldronV1', () => {
        beforeEach(() => {
            clearStore();

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
        });

        test('should create protocol', () => {
            const newLogDeployEvent = createLogDeploy(CAULDRON_V1_MASTER_CONTRACT_ADDRESS, CAULDRON_V1_DATA, CLONE_ADDRESS);

            handleLogDeploy(newLogDeployEvent);

            // Created protocol
            assert.entityCount(PROTOCOL_ENTITY, 1);
            const protocolId = getOrCreateProtocol().id;
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalValueLockedUsd', BIGDECIMAL_ZERO.toString());
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalFeesGenerated', BIGDECIMAL_ZERO.toString());
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalCauldronCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'cumulativeUniqueUsers', '0');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'liquidationCount', '0');
        });

        test('should create bentobox', () => {
            const newLogDeployEvent = createLogDeploy(CAULDRON_V1_MASTER_CONTRACT_ADDRESS, CAULDRON_V1_DATA, CLONE_ADDRESS);

            handleLogDeploy(newLogDeployEvent);

            const protocolId = getOrCreateProtocol().id;

            assert.entityCount(BENTO_BOX_ENTITY, 1);
            const bentBoxId = BENTO_BOX_ADDRESS.toHexString();
            assert.fieldEquals(BENTO_BOX_ENTITY, bentBoxId, 'protocol', protocolId);
        });

        test('should create collateral', () => {
            const newLogDeployEvent = createLogDeploy(CAULDRON_V1_MASTER_CONTRACT_ADDRESS, CAULDRON_V1_DATA, CLONE_ADDRESS);

            handleLogDeploy(newLogDeployEvent);

            // Created Collateral
            const collateralId = getOrCreateCollateral(CAULDRON_V1_COLLATERAL_ADDRESS).id;
            assert.entityCount(COLLATERAL_ENTITY, 1);
            assert.fieldEquals(COLLATERAL_ENTITY, collateralId, 'symbol', COLLATERAL_SYMBOL);
            assert.fieldEquals(COLLATERAL_ENTITY, collateralId, 'name', COLLATERAL_NAME);
            assert.fieldEquals(COLLATERAL_ENTITY, collateralId, 'decimals', COLLATERAL_DECIMALS.toString());
            assert.fieldEquals(COLLATERAL_ENTITY, collateralId, 'lastPriceUsd', BIGDECIMAL_ZERO.toString());
            assert.fieldEquals(COLLATERAL_ENTITY, collateralId, 'lastPriceBlockNumber', BIGINT_ZERO.toString());
        });

        test('should create cauldron', () => {
            const newLogDeployEvent = createLogDeploy(CAULDRON_V1_MASTER_CONTRACT_ADDRESS, CAULDRON_V1_DATA, CLONE_ADDRESS);

            handleLogDeploy(newLogDeployEvent);

            // Created Cauldron
            const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
            const collateralId = getOrCreateCollateral(CAULDRON_V1_COLLATERAL_ADDRESS).id;
            const protocolId = getOrCreateProtocol().id;

            assert.entityCount(CAULDRON_ENTITY, 1);
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'masterContract', CAULDRON_V1_MASTER_CONTRACT_ADDRESS.toHexString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'collateral', collateralId);
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'name', COLLATERAL_SYMBOL);
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'createdTimestamp', newLogDeployEvent.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'createdBlockNumber', newLogDeployEvent.block.number.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'collateralPriceUsd', '0');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'exchangeRate', '0');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'protocol', protocolId);
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'isActive', 'false');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'deprecated', 'false');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'lastActive', newLogDeployEvent.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'totalFeesGenerated', '0');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'borrowOpeningFee', '50');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'collaterizationRate', '90000');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'interestPerSecond', '253509908');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'liquidationMultiplier', '103000');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'oracle', '0x6cc0cd7d25e291029b55c767b9a2d1d9a18ae668');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'cumulativeUniqueUsers', '0');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'oracleData', '0x00');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'liquidationCount', '0');
        });
    });
});
