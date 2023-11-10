import { assert, beforeEach, clearStore, createMockedFunction, describe, test } from 'matchstick-as/assembly';
import { S_SPELL, S_SPELL_DAILY_SNAPSHOT, S_SPELL_HOURY_SNAPSHOT } from './constants';
import { createLogTransfer } from './helpers/create-log-transfer';
import { handleLogTransfer } from '../src/mappings/sspell';
import { SSPELL_ADDRESS, SPELL_ORACLE_ADDRESS, SPELL_ADDRESS } from '../src/constants';
import { Address, ethereum, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { getOrCreateSspellDailySnapshot } from '../src/helpers/get-or-create-sspell-daily-snapshot';
import { getOrCreateSspellHourySnapshot } from '../src/helpers/get-or-create-sspell-houry-snapshot';

describe('sSpell', () => {
    describe('handleLogTransfer', () => {
        beforeEach(() => {
            clearStore();

            createMockedFunction(Address.fromString(SPELL_ADDRESS), 'balanceOf', 'balanceOf(address):(uint256)')
                .withArgs([ethereum.Value.fromAddress(Address.fromString(SSPELL_ADDRESS))])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('661736539747737957'))]);

            createMockedFunction(Address.fromString(SPELL_ORACLE_ADDRESS), 'peekSpot', 'peekSpot(bytes):(uint256)')
                .withArgs([ethereum.Value.fromBytes(Bytes.empty())])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1860880568685101790167'))]);
        });

        test('should update sSpell', () => {
            const log = createLogTransfer();

            handleLogTransfer(log);

            assert.fieldEquals(S_SPELL, SSPELL_ADDRESS, 'totalValueLocked', '0.661736539747737957');
            assert.fieldEquals(S_SPELL, SSPELL_ADDRESS, 'totalValueLockedUsd', '0.0003556039817296394233326804614531087');
            assert.fieldEquals(S_SPELL, SSPELL_ADDRESS, 'dailySnapshotCount', '1');
            assert.fieldEquals(S_SPELL, SSPELL_ADDRESS, 'hourySnapshotCount', '1');
        });

        test('should update dailySnapshot', () => {
            const log = createLogTransfer();

            handleLogTransfer(log);

            const dailySnapshot = getOrCreateSspellDailySnapshot(log.block);

            assert.fieldEquals(S_SPELL_DAILY_SNAPSHOT, dailySnapshot.id, 'totalValueLocked', '0.661736539747737957');
            assert.fieldEquals(S_SPELL_DAILY_SNAPSHOT, dailySnapshot.id, 'totalValueLockedUsd', '0.0003556039817296394233326804614531087');
        });

        test('should update hourySnapshot', () => {
            const log = createLogTransfer();

            handleLogTransfer(log);

            const hourySnapshot = getOrCreateSspellHourySnapshot(log.block);

            assert.fieldEquals(S_SPELL_HOURY_SNAPSHOT, hourySnapshot.id, 'totalValueLocked', '0.661736539747737957');
            assert.fieldEquals(S_SPELL_HOURY_SNAPSHOT, hourySnapshot.id, 'totalValueLockedUsd', '0.0003556039817296394233326804614531087');
        });
    });
});
