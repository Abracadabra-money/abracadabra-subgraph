import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, createMockedFunction, describe, test } from 'matchstick-as';
import { createCauldron, getCauldron, getOrCreateCauldronDailySnapshot, getOrCreateCauldronHourySnapshot } from '../src/helpers/cauldron';
import {
    CLONE_ADDRESS,
    BLOCK_NUMBER,
    BLOCK_TIMESTAMP,
    COLLATERAL_DECIMALS,
    COLLATERAL_NAME,
    COLLATERAL_SYMBOL,
    CAULDRON_HOURY_SNAPSHOT,
    CAULDRON_DAILY_SNAPSHOT,
    PROTOCOL_DAILY_SNAPSHOT,
    PROTOCOL_HOURY_SNAPSHOT,
    CAULDRON_ENTITY_TYPE,
    NON_CAULDRON_V1_COLLATERAL_ADDRESS,
    NON_CAULDRON_V1_DATA,
    NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS,
    COLLATERAL_ENTITY_TYPE,
    CAULDRON_V1_COLLATERAL_ADDRESS,
} from './constants';
import { handleLogAccrue, handleLogExchangeRate } from '../src/mappings/cauldron';

import { getOrCreateProtocolDailySnapshot, getOrCreateProtocolHourySnapshot } from '../src/helpers/protocol';
import { createLogAccrue } from './helpers/create-log-accrue';
import { bigIntToBigDecimal } from 'misc';
import { createLogExchangeRate } from './helpers/create-log-exchange-rate';
import { getOrCreateCollateral } from '../src/helpers/collateral';

describe('Cauldrons', () => {
    beforeEach(() => {
        createMockedFunction(CLONE_ADDRESS, 'BORROW_OPENING_FEE', 'BORROW_OPENING_FEE():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(0)]);

        createMockedFunction(CLONE_ADDRESS, 'oracleData', 'oracleData():(bytes)')
            .withArgs([])
            .returns([ethereum.Value.fromBytes(Bytes.fromHexString('0x00'))]);

        createMockedFunction(NON_CAULDRON_V1_COLLATERAL_ADDRESS, 'symbol', 'symbol():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_SYMBOL)]);

        createMockedFunction(NON_CAULDRON_V1_COLLATERAL_ADDRESS, 'name', 'name():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_NAME)]);

        createMockedFunction(NON_CAULDRON_V1_COLLATERAL_ADDRESS, 'decimals', 'decimals():(uint8)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(COLLATERAL_DECIMALS)]);

        createMockedFunction(CAULDRON_V1_COLLATERAL_ADDRESS, 'symbol', 'symbol():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_SYMBOL)]);

        createMockedFunction(CAULDRON_V1_COLLATERAL_ADDRESS, 'name', 'name():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_NAME)]);

        createMockedFunction(CAULDRON_V1_COLLATERAL_ADDRESS, 'decimals', 'decimals():(uint8)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(COLLATERAL_DECIMALS)]);

        // createMockedFunction(SPELL_ORACLE_ADDRESS, 'peekSpot', 'peekSpot(bytes):(uint256)')
        //     .withArgs([ethereum.Value.fromBytes(SPELL_ORACLE_DATA)])
        //     .returns([ethereum.Value.fromUnsignedBigInt(SPELL_ORACLE_PRICE)]);

        // createMockedFunction(CLONE_ADDRESS, 'totalBorrow', 'totalBorrow():(uint128,uint128)')
        //     .withArgs([])
        //     .returns([ethereum.Value.fromSignedBigInt(BigInt.fromString('0')), ethereum.Value.fromSignedBigInt(BigInt.fromString('0'))]);
    });

    describe('LogAccrue', () => {
        beforeEach(() => {
            clearStore();

            createCauldron(CLONE_ADDRESS, NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, NON_CAULDRON_V1_DATA);
        });

        test('should update cauldron', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogAccrue(amount);

            handleLogAccrue(log);

            const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'lastActive', log.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'isActive', 'true');
        });

        test('should update protocol daily snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const newLogAccrueEvent = createLogAccrue(amount);

            handleLogAccrue(newLogAccrueEvent);

            const protocolDailySnapshotId = getOrCreateProtocolDailySnapshot(newLogAccrueEvent.block).id;
            assert.entityCount(PROTOCOL_DAILY_SNAPSHOT, 1);
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT, protocolDailySnapshotId, 'feesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT, protocolDailySnapshotId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());
        });

        test('should update protocol houry snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const newLogAccrueEvent = createLogAccrue(amount);

            handleLogAccrue(newLogAccrueEvent);

            const protocolHourySnapshotId = getOrCreateProtocolHourySnapshot(newLogAccrueEvent.block).id;
            assert.entityCount(PROTOCOL_HOURY_SNAPSHOT, 1);
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT, protocolHourySnapshotId, 'feesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT, protocolHourySnapshotId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());
        });

        test('should update cauldron daily snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const newLogAccrueEvent = createLogAccrue(amount);

            handleLogAccrue(newLogAccrueEvent);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronDailySnapshotId = getOrCreateCauldronDailySnapshot(cauldron, newLogAccrueEvent.block).id;
            assert.entityCount(CAULDRON_DAILY_SNAPSHOT, 1);
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'feesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());
        });

        test('should update cauldron houry snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const newLogAccrueEvent = createLogAccrue(amount);

            handleLogAccrue(newLogAccrueEvent);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronHourySnapshotId = getOrCreateCauldronHourySnapshot(cauldron, newLogAccrueEvent.block).id;
            assert.entityCount(CAULDRON_HOURY_SNAPSHOT, 1);
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT, cauldronHourySnapshotId, 'feesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT, cauldronHourySnapshotId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());
        });
    });

    describe('LogExchangeRate', () => {
        beforeEach(() => {
            clearStore();

            createCauldron(CLONE_ADDRESS, NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, NON_CAULDRON_V1_DATA);
        });

        test('should update cauldron', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogExchangeRate(amount);

            handleLogExchangeRate(log);

            const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'lastActive', log.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'isActive', 'true');
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'exchangeRate', amount.toString());
            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldronId, 'collateralPriceUsd', '100000000000');
        });

        test('should update collateral', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogExchangeRate(amount);

            handleLogExchangeRate(log);

            const collateral = getOrCreateCollateral(NON_CAULDRON_V1_COLLATERAL_ADDRESS);
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateral.id, 'lastPriceUsd', '100000000000');
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateral.id, 'lastPriceBlockNumber', log.block.number.toString());
            assert.fieldEquals(COLLATERAL_ENTITY_TYPE, collateral.id, 'lastPriceTimestamp', log.block.timestamp.toString());
        });

        test('should update tvl', () => {});
    });

    describe('handleLogRepay', () => {});
    describe('handleLogBorrow', () => {});
    describe('handleLogRemoveCollateral', () => {});
    describe('handleLogAddCollateral', () => {});
});
