import { assert, describe, test, beforeEach, createMockedFunction, clearStore } from 'matchstick-as/assembly';
import { createLogDeposit } from './helpers/magic-ape/create-log-deposit';
import { createLogWithdraw } from './helpers/magic-ape/create-log-withdraw';
import { handleLogDeposit, handleLogWithdraw } from '../src/mappings/magic-ape';
import { MAGIC_APE_DAILY_SNAPSHOT_ENTITY, MAGIC_APE_ENTITY, MAGIC_APE_HOURY_SNAPSHOT_ENTITY } from './constants';
import { APE_ORACLE_ADDRESS, MAGIC_APE_ADDRESS } from '../src/constants';
import { Address, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { getOrCreateMagicApeDailySnapshot } from '../src/helpers/get-or-create-magic-ape-daily-snapshot';
import { getOrCreateMagicApeHourySnapshot } from '../src/helpers/get-or-create-magic-ape-houry-snapshot';
import { BIGDECIMAL_ONE, DEFAULT_DECIMALS, bigIntToBigDecimal, exponentToBigInt } from 'misc';
import { BigInt } from '@graphprotocol/graph-ts';

describe('Magic Ape', () => {
    describe('handleLogDeposit', () => {
        beforeEach(() => {
            clearStore();

            createMockedFunction(Address.fromString(APE_ORACLE_ADDRESS), 'peekSpot', 'peekSpot(bytes):(uint256)')
                .withArgs([ethereum.Value.fromBytes(Bytes.fromHexString('0x'))])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('661736539747737957'))]);

            createMockedFunction(Address.fromString(MAGIC_APE_ADDRESS), 'totalAssets', 'totalAssets():(uint256)')
                .withArgs([])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('17716551367978716107096'))]);

            createMockedFunction(Address.fromString(MAGIC_APE_ADDRESS), 'convertToAssets', 'convertToAssets(uint256):(uint256)')
                .withArgs([ethereum.Value.fromUnsignedBigInt(exponentToBigInt(DEFAULT_DECIMALS))])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1305073939070772931'))]);
        });

        test('create magic ape entity', () => {
            const logDeposit = createLogDeposit();

            handleLogDeposit(logDeposit);

            assert.entityCount(MAGIC_APE_ENTITY, 1);
        });

        test('update houry snapshot', () => {
            const logDeposit = createLogDeposit();

            handleLogDeposit(logDeposit);

            const totalAssets = bigIntToBigDecimal(BigInt.fromString('17716551367978716107096'));
            const price = BIGDECIMAL_ONE.div(bigIntToBigDecimal(BigInt.fromString('661736539747737957')));

            const dailySnapshot = getOrCreateMagicApeDailySnapshot(logDeposit.block);
            assert.fieldEquals(MAGIC_APE_DAILY_SNAPSHOT_ENTITY, dailySnapshot.id, 'totalValueLockedUsd', totalAssets.times(price).toString());

            const convertToAssets = bigIntToBigDecimal(BigInt.fromString('1305073939070772931'));
            assert.fieldEquals(MAGIC_APE_DAILY_SNAPSHOT_ENTITY, dailySnapshot.id, 'price', convertToAssets.times(price).toString());
        });

        test('update daily snapshot', () => {
            const logDeposit = createLogDeposit();

            handleLogDeposit(logDeposit);

            assert.entityCount(MAGIC_APE_ENTITY, 1);

            const totalAssets = bigIntToBigDecimal(BigInt.fromString('17716551367978716107096'));
            const price = BIGDECIMAL_ONE.div(bigIntToBigDecimal(BigInt.fromString('661736539747737957')));

            const hourySnapshot = getOrCreateMagicApeHourySnapshot(logDeposit.block);
            assert.fieldEquals(MAGIC_APE_HOURY_SNAPSHOT_ENTITY, hourySnapshot.id, 'totalValueLockedUsd', totalAssets.times(price).toString());

            const convertToAssets = bigIntToBigDecimal(BigInt.fromString('1305073939070772931'));
            assert.fieldEquals(MAGIC_APE_HOURY_SNAPSHOT_ENTITY, hourySnapshot.id, 'price', convertToAssets.times(price).toString());
        });
    });

    describe('handleLogWithdraw', () => {
        beforeEach(() => {
            clearStore();

            createMockedFunction(Address.fromString(APE_ORACLE_ADDRESS), 'peekSpot', 'peekSpot(bytes):(uint256)')
                .withArgs([ethereum.Value.fromBytes(Bytes.fromHexString('0x'))])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('661736539747737957'))]);

            createMockedFunction(Address.fromString(MAGIC_APE_ADDRESS), 'totalAssets', 'totalAssets():(uint256)')
                .withArgs([])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('17716551367978716107096'))]);

            createMockedFunction(Address.fromString(MAGIC_APE_ADDRESS), 'convertToAssets', 'convertToAssets(uint256):(uint256)')
                .withArgs([ethereum.Value.fromUnsignedBigInt(exponentToBigInt(DEFAULT_DECIMALS))])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1305073939070772931'))]);
        });

        test('create magic ape entity', () => {
            const logDeposit = createLogWithdraw();

            handleLogWithdraw(logDeposit);

            assert.entityCount(MAGIC_APE_ENTITY, 1);
        });

        test('update houry snapshot', () => {
            const logWithdraw = createLogWithdraw();

            handleLogWithdraw(logWithdraw);

            const totalAssets = bigIntToBigDecimal(BigInt.fromString('17716551367978716107096'));
            const price = BIGDECIMAL_ONE.div(bigIntToBigDecimal(BigInt.fromString('661736539747737957')));

            const dailySnapshot = getOrCreateMagicApeDailySnapshot(logWithdraw.block);
            assert.fieldEquals(MAGIC_APE_DAILY_SNAPSHOT_ENTITY, dailySnapshot.id, 'totalValueLockedUsd', totalAssets.times(price).toString());

            const convertToAssets = bigIntToBigDecimal(BigInt.fromString('1305073939070772931'));
            assert.fieldEquals(MAGIC_APE_DAILY_SNAPSHOT_ENTITY, dailySnapshot.id, 'price', convertToAssets.times(price).toString());
        });

        test('update daily snapshot', () => {
            const logDeposit = createLogWithdraw();

            handleLogWithdraw(logDeposit);

            assert.entityCount(MAGIC_APE_ENTITY, 1);

            const totalAssets = bigIntToBigDecimal(BigInt.fromString('17716551367978716107096'));
            const price = BIGDECIMAL_ONE.div(bigIntToBigDecimal(BigInt.fromString('661736539747737957')));

            const hourySnapshot = getOrCreateMagicApeHourySnapshot(logDeposit.block);
            assert.fieldEquals(MAGIC_APE_HOURY_SNAPSHOT_ENTITY, hourySnapshot.id, 'totalValueLockedUsd', totalAssets.times(price).toString());

            const convertToAssets = bigIntToBigDecimal(BigInt.fromString('1305073939070772931'));
            assert.fieldEquals(MAGIC_APE_HOURY_SNAPSHOT_ENTITY, hourySnapshot.id, 'price', convertToAssets.times(price).toString());
        });
    });
});
