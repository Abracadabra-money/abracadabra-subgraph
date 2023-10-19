import { createLogHarvest } from './helpers/create-log-harvest';
import { handleLogHarvest } from '../src/mappings/level-finance';
import {
    MAGIC_LLP_JUNIOR,
    MAGIC_LLP_MEZZANINE,
    MAGIC_LLP_SENIOR,
    LEVEL_FINANCE_JUNIOR_LLP,
    LEVEL_FINANCE_MEZZANINE_LLP,
    LEVEL_FINANCE_SENIOR_LLP,
    LEVEL_FINANCE_LIQUIDITY_POOL,
} from '../src/constants';
import { assert, describe, test, beforeEach, createMockedFunction, clearStore } from 'matchstick-as/assembly';
import {
    LEVEL_FINANCE_DAILY_SNAPSHOT_ENTITY,
    LEVEL_FINANCE_ENTITY,
    LEVEL_FINANCE_HOURY_SNAPSHOT_ENTITY,
    LEVEL_FINANCE_JUNIOR_ENTITY,
    LEVEL_FINANCE_MEZZANINE_ENTITY,
    LEVEL_FINANCE_SENIOR_ENTITY,
} from './constants';
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { getOrCreateLevelFinanceDailySnapshot } from '../src/helpers/get-or-create-level-finance-daily-snapshot';
import { getOrCreateLevelFinanceHourySnapshot } from '../src/helpers/get-or-create-level-finance-houry-snapshot';

describe('handleLogHarvest', () => {
    beforeEach(() => {
        createMockedFunction(Address.fromString(LEVEL_FINANCE_JUNIOR_LLP), 'totalSupply', 'totalSupply():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1195440559284488611981929'))]);

        createMockedFunction(Address.fromString(LEVEL_FINANCE_MEZZANINE_LLP), 'totalSupply', 'totalSupply():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1192095675657971600840645'))]);

        createMockedFunction(Address.fromString(LEVEL_FINANCE_SENIOR_LLP), 'totalSupply', 'totalSupply():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('6666217256860816127517090'))]);

        createMockedFunction(Address.fromString(LEVEL_FINANCE_LIQUIDITY_POOL), 'getTrancheValue', 'getTrancheValue(address,bool):(uint256)')
            .withArgs([ethereum.Value.fromAddress(Address.fromString(LEVEL_FINANCE_JUNIOR_LLP)), ethereum.Value.fromBoolean(true)])
            .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1026002697009095369646214478883998283'))]);

        createMockedFunction(Address.fromString(LEVEL_FINANCE_LIQUIDITY_POOL), 'getTrancheValue', 'getTrancheValue(address,bool):(uint256)')
            .withArgs([ethereum.Value.fromAddress(Address.fromString(LEVEL_FINANCE_MEZZANINE_LLP)), ethereum.Value.fromBoolean(true)])
            .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('932598472427258194097024651920356116'))]);

        createMockedFunction(Address.fromString(LEVEL_FINANCE_LIQUIDITY_POOL), 'getTrancheValue', 'getTrancheValue(address,bool):(uint256)')
            .withArgs([ethereum.Value.fromAddress(Address.fromString(LEVEL_FINANCE_SENIOR_LLP)), ethereum.Value.fromBoolean(true)])
            .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('6604098206194563905843109974078625693'))]);

        createMockedFunction(Address.fromString(MAGIC_LLP_JUNIOR), 'totalSupply', 'totalSupply():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('7032939238541119172505'))]);

        createMockedFunction(Address.fromString(MAGIC_LLP_MEZZANINE), 'totalSupply', 'totalSupply():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('11053564472825949190976'))]);

        createMockedFunction(Address.fromString(MAGIC_LLP_SENIOR), 'totalSupply', 'totalSupply():(uint256)')
            .withArgs([])
            .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('418163244654168641514'))]);
    });

    describe('Junior', () => {
        beforeEach(() => {
            clearStore();
        });

        test('should create level finance', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_JUNIOR, amount);

            handleLogHarvest(log);

            assert.entityCount(LEVEL_FINANCE_ENTITY, 1);
        });

        test('should update junior data', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_JUNIOR, amount);

            handleLogHarvest(log);

            assert.entityCount(LEVEL_FINANCE_JUNIOR_ENTITY, 1);
            assert.fieldEquals(LEVEL_FINANCE_JUNIOR_ENTITY, LEVEL_FINANCE_JUNIOR_LLP, 'lpPriceUsd', '0.858263247838');
            assert.fieldEquals(LEVEL_FINANCE_JUNIOR_ENTITY, LEVEL_FINANCE_JUNIOR_LLP, 'totalRewards', amount.toString());
        });

        test('should update daily snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_JUNIOR, amount);

            handleLogHarvest(log);

            const snapshot = getOrCreateLevelFinanceDailySnapshot(log.block);

            assert.entityCount(LEVEL_FINANCE_DAILY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(LEVEL_FINANCE_DAILY_SNAPSHOT_ENTITY, snapshot.id, 'juniorRewards', amount.toString());
            assert.fieldEquals(LEVEL_FINANCE_DAILY_SNAPSHOT_ENTITY, snapshot.id, 'juniorApy', '0.00000000004454269756009615227037459691120117');
        });

        test('should update houry snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_JUNIOR, amount);

            handleLogHarvest(log);

            const snapshot = getOrCreateLevelFinanceHourySnapshot(log.block);

            assert.entityCount(LEVEL_FINANCE_HOURY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(LEVEL_FINANCE_HOURY_SNAPSHOT_ENTITY, snapshot.id, 'juniorRewards', amount.toString());
            assert.fieldEquals(LEVEL_FINANCE_HOURY_SNAPSHOT_ENTITY, snapshot.id, 'juniorApy', '0.00000000004454269756009615227037459691120117');
        });
    });

    describe('Mezzanine', () => {
        beforeEach(() => {
            clearStore();
        });

        test('should create level finance', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_MEZZANINE, amount);

            handleLogHarvest(log);

            assert.entityCount(LEVEL_FINANCE_ENTITY, 1);
        });

        test('should update junior data', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_MEZZANINE, amount);

            handleLogHarvest(log);

            assert.entityCount(LEVEL_FINANCE_MEZZANINE_ENTITY, 1);
            assert.fieldEquals(LEVEL_FINANCE_MEZZANINE_ENTITY, LEVEL_FINANCE_MEZZANINE_LLP, 'lpPriceUsd', '0.782318476168');
            assert.fieldEquals(LEVEL_FINANCE_MEZZANINE_ENTITY, LEVEL_FINANCE_MEZZANINE_LLP, 'totalRewards', amount.toString());
        });

        test('should update daily snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_MEZZANINE, amount);

            handleLogHarvest(log);

            const snapshot = getOrCreateLevelFinanceDailySnapshot(log.block);

            assert.entityCount(LEVEL_FINANCE_DAILY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(LEVEL_FINANCE_DAILY_SNAPSHOT_ENTITY, snapshot.id, 'mezzanineRewards', amount.toString());
            assert.fieldEquals(LEVEL_FINANCE_DAILY_SNAPSHOT_ENTITY, snapshot.id, 'mezzanineApy', '0.00000000002583295592144109321083870007308053');
        });

        test('should update houry snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_MEZZANINE, amount);

            handleLogHarvest(log);

            const snapshot = getOrCreateLevelFinanceHourySnapshot(log.block);

            assert.entityCount(LEVEL_FINANCE_HOURY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(LEVEL_FINANCE_HOURY_SNAPSHOT_ENTITY, snapshot.id, 'mezzanineRewards', amount.toString());
            assert.fieldEquals(LEVEL_FINANCE_HOURY_SNAPSHOT_ENTITY, snapshot.id, 'mezzanineApy', '0.00000000002583295592144109321083870007308053');
        });
    });

    describe('Senior', () => {
        beforeEach(() => {
            clearStore();
        });

        test('should create level finance', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_SENIOR, amount);

            handleLogHarvest(log);

            assert.entityCount(LEVEL_FINANCE_ENTITY, 1);
        });

        test('should update junior data', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_SENIOR, amount);

            handleLogHarvest(log);

            assert.entityCount(LEVEL_FINANCE_SENIOR_ENTITY, 1);
            assert.fieldEquals(LEVEL_FINANCE_SENIOR_ENTITY, LEVEL_FINANCE_SENIOR_LLP, 'lpPriceUsd', '0.990681514227');
            assert.fieldEquals(LEVEL_FINANCE_SENIOR_ENTITY, LEVEL_FINANCE_SENIOR_LLP, 'totalRewards', amount.toString());
        });

        test('should update daily snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_SENIOR, amount);

            handleLogHarvest(log);

            const snapshot = getOrCreateLevelFinanceDailySnapshot(log.block);

            assert.entityCount(LEVEL_FINANCE_DAILY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(LEVEL_FINANCE_DAILY_SNAPSHOT_ENTITY, snapshot.id, 'seniorRewards', amount.toString());
            assert.fieldEquals(LEVEL_FINANCE_DAILY_SNAPSHOT_ENTITY, snapshot.id, 'seniorApy', '0.0000000008647310764768580340030912392605243');
        });

        test('should update houry snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogHarvest(MAGIC_LLP_SENIOR, amount);

            handleLogHarvest(log);

            const snapshot = getOrCreateLevelFinanceHourySnapshot(log.block);

            assert.entityCount(LEVEL_FINANCE_HOURY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(LEVEL_FINANCE_HOURY_SNAPSHOT_ENTITY, snapshot.id, 'seniorRewards', amount.toString());
            assert.fieldEquals(LEVEL_FINANCE_HOURY_SNAPSHOT_ENTITY, snapshot.id, 'seniorApy', '0.0000000008647310764768580340030912392605243');
        });
    });
});
