import { assert, beforeEach, clearStore, createMockedFunction, describe, test } from 'matchstick-as/assembly';
import { M_SPELL, M_SPELL_DAILY_SNAPSHOT, M_SPELL_HOURY_SNAPSHOT } from './constants';
import { createLogDeposit } from './helpers/create-log-deposit';
import { createLogWithdraw } from './helpers/create-log-withdraw';
import { handleLogDeposit, handleLogWithdraw } from '../src/mappings/mspell';
import { MSPELL_ADDRESS, SPELL_ORACLE_ADDRESS, SPELL_ADDRESS } from '../src/constants';
import { Address, ethereum, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { getOrCreateMspellDailySnapshot } from '../src/helpers/get-or-create-mspell-daily-snapshot';
import { getOrCreateMspellHourySnapshot } from '../src/helpers/get-or-create-mspell-houry-snapshot';

describe('mSpell', () => {
    describe('handleLogDeposit', () => {
        beforeEach(() => {
            clearStore();

            createMockedFunction(Address.fromString(SPELL_ADDRESS), 'balanceOf', 'balanceOf(address):(uint256)')
                .withArgs([ethereum.Value.fromAddress(Address.fromString(MSPELL_ADDRESS))])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('661736539747737957'))]);

            createMockedFunction(Address.fromString(SPELL_ORACLE_ADDRESS), 'peekSpot', 'peekSpot(bytes):(uint256)')
                .withArgs([ethereum.Value.fromBytes(Bytes.empty())])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1860880568685101790167'))]);
        });

        test('should update mSpell', () => {
            const log = createLogDeposit();

            handleLogDeposit(log);

            assert.fieldEquals(M_SPELL, MSPELL_ADDRESS, 'totalValueLocked', '0.661736539747737957');
            assert.fieldEquals(M_SPELL, MSPELL_ADDRESS, 'totalValueLockedUsd', '0.0003556039817296394233326804614531087');
        });

        test('should update dailySnapshot', () => {
            const log = createLogDeposit();

            handleLogDeposit(log);

            const dailySnapshot = getOrCreateMspellDailySnapshot(log.block);

            assert.fieldEquals(M_SPELL_DAILY_SNAPSHOT, dailySnapshot.id, 'totalValueLocked', '0.661736539747737957');
            assert.fieldEquals(M_SPELL_DAILY_SNAPSHOT, dailySnapshot.id, 'totalValueLockedUsd', '0.0003556039817296394233326804614531087');
        });

        test('should update hourySnapshot', () => {
            const log = createLogDeposit();

            handleLogDeposit(log);

            const hourySnapshot = getOrCreateMspellHourySnapshot(log.block);

            assert.fieldEquals(M_SPELL_HOURY_SNAPSHOT, hourySnapshot.id, 'totalValueLocked', '0.661736539747737957');
            assert.fieldEquals(M_SPELL_HOURY_SNAPSHOT, hourySnapshot.id, 'totalValueLockedUsd', '0.0003556039817296394233326804614531087');
        });
    });

    describe('handleLogWithdraw', () => {
        beforeEach(() => {
            clearStore();

            createMockedFunction(Address.fromString(SPELL_ADDRESS), 'balanceOf', 'balanceOf(address):(uint256)')
                .withArgs([ethereum.Value.fromAddress(Address.fromString(MSPELL_ADDRESS))])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('661736539747737957'))]);

            createMockedFunction(Address.fromString(SPELL_ORACLE_ADDRESS), 'peekSpot', 'peekSpot(bytes):(uint256)')
                .withArgs([ethereum.Value.fromBytes(Bytes.empty())])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1860880568685101790167'))]);
        });

        test('should update mSpell', () => {
            const log = createLogDeposit();

            handleLogDeposit(log);

            assert.fieldEquals(M_SPELL, MSPELL_ADDRESS, 'totalValueLocked', '0.661736539747737957');
            assert.fieldEquals(M_SPELL, MSPELL_ADDRESS, 'totalValueLockedUsd', '0.0003556039817296394233326804614531087');
        });

        test('should update dailySnapshot', () => {
            const log = createLogDeposit();

            handleLogDeposit(log);

            const dailySnapshot = getOrCreateMspellDailySnapshot(log.block);

            assert.fieldEquals(M_SPELL_DAILY_SNAPSHOT, dailySnapshot.id, 'totalValueLocked', '0.661736539747737957');
            assert.fieldEquals(M_SPELL_DAILY_SNAPSHOT, dailySnapshot.id, 'totalValueLockedUsd', '0.0003556039817296394233326804614531087');
        });

        test('should update hourySnapshot', () => {
            const log = createLogDeposit();

            handleLogDeposit(log);

            const hourySnapshot = getOrCreateMspellHourySnapshot(log.block);

            assert.fieldEquals(M_SPELL_HOURY_SNAPSHOT, hourySnapshot.id, 'totalValueLocked', '0.661736539747737957');
            assert.fieldEquals(M_SPELL_HOURY_SNAPSHOT, hourySnapshot.id, 'totalValueLockedUsd', '0.0003556039817296394233326804614531087');
        });
    });
});
