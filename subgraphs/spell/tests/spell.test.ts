import { assert, beforeEach, clearStore, createMockedFunction, describe, test } from 'matchstick-as/assembly';
import { handleLogTransfer } from '../src/mappings/spell';
import { getOrCreateSpellDailySnapshot } from '../src/helpers/get-or-create-spell-daily-snapshot';
import { getOrCreateSpellHourySnapshot } from '../src/helpers/get-or-create-spell-houry-snapshot';
import { SPELL, SPELL_DAILY_SNAPSHOT, SPELL_HOURY_SNAPSHOT } from './constants';
import { createLogTransfer } from './helpers/create-log-transfer';
import { Address, Bytes, ethereum, BigInt } from '@graphprotocol/graph-ts';
import { SPELL_ADDRESS, SPELL_ORACLE_ADDRESS } from '../src/constants';
import { ZERO_ADDRESS } from 'misc';

describe('Spell', () => {
    describe('handleLogTransfer', () => {
        beforeEach(() => {
            clearStore();

            createMockedFunction(Address.fromString(SPELL_ORACLE_ADDRESS), 'peekSpot', 'peekSpot(bytes):(uint256)')
                .withArgs([ethereum.Value.fromBytes(Bytes.empty())])
                .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1860880568685101790167'))]);
        });

        describe('mint', () => {
            test('should update spell', () => {
                const log = createLogTransfer(Address.fromString(ZERO_ADDRESS), Address.fromString(SPELL_ADDRESS), 1000000);

                handleLogTransfer(log);

                assert.fieldEquals(SPELL, SPELL_ADDRESS, 'hourySnapshotCount', '1');
                assert.fieldEquals(SPELL, SPELL_ADDRESS, 'dailySnapshotCount', '1');
                assert.fieldEquals(SPELL, SPELL_ADDRESS, 'totalMinted', '0.000000000001');
                assert.fieldEquals(SPELL, SPELL_ADDRESS, 'totalMintedUsd', '0.0000000000000005373800000000000000000309208452');
            });

            test('should update dailySnapshot', () => {
                const log = createLogTransfer(Address.fromString(ZERO_ADDRESS), Address.fromString(SPELL_ADDRESS), 1000000);

                handleLogTransfer(log);

                const dailySnapshot = getOrCreateSpellDailySnapshot(log.block);

                assert.fieldEquals(SPELL_DAILY_SNAPSHOT, dailySnapshot.id, 'minted', '0.000000000001');
                assert.fieldEquals(SPELL_DAILY_SNAPSHOT, dailySnapshot.id, 'mintedUsd', '0.0000000000000005373800000000000000000309208452');
            });

            test('should update hourySnapshot', () => {
                const log = createLogTransfer(Address.fromString(ZERO_ADDRESS), Address.fromString(SPELL_ADDRESS), 1000000);

                handleLogTransfer(log);

                const hourySnapshot = getOrCreateSpellHourySnapshot(log.block);

                assert.fieldEquals(SPELL_HOURY_SNAPSHOT, hourySnapshot.id, 'minted', '0.000000000001');
                assert.fieldEquals(SPELL_HOURY_SNAPSHOT, hourySnapshot.id, 'mintedUsd', '0.0000000000000005373800000000000000000309208452');
            });
        });

        describe('burn', () => {
            test('should update spell', () => {
                const log = createLogTransfer(Address.fromString(SPELL_ADDRESS), Address.fromString(ZERO_ADDRESS), 1000000);

                handleLogTransfer(log);

                assert.fieldEquals(SPELL, SPELL_ADDRESS, 'hourySnapshotCount', '1');
                assert.fieldEquals(SPELL, SPELL_ADDRESS, 'dailySnapshotCount', '1');
                assert.fieldEquals(SPELL, SPELL_ADDRESS, 'totalBurned', '0.000000000001');
                assert.fieldEquals(SPELL, SPELL_ADDRESS, 'totalBurnedUsd', '0.0000000000000005373800000000000000000309208452');
            });

            test('should update dailySnapshot', () => {
                const log = createLogTransfer(Address.fromString(SPELL_ADDRESS), Address.fromString(ZERO_ADDRESS), 1000000);

                handleLogTransfer(log);

                const dailySnapshot = getOrCreateSpellDailySnapshot(log.block);

                assert.fieldEquals(SPELL_DAILY_SNAPSHOT, dailySnapshot.id, 'burned', '0.000000000001');
                assert.fieldEquals(SPELL_DAILY_SNAPSHOT, dailySnapshot.id, 'burnedUsd', '0.0000000000000005373800000000000000000309208452');
            });

            test('should update hourySnapshot', () => {
                const log = createLogTransfer(Address.fromString(SPELL_ADDRESS), Address.fromString(ZERO_ADDRESS), 1000000);

                handleLogTransfer(log);

                const hourySnapshot = getOrCreateSpellHourySnapshot(log.block);

                assert.fieldEquals(SPELL_HOURY_SNAPSHOT, hourySnapshot.id, 'burned', '0.000000000001');
                assert.fieldEquals(SPELL_HOURY_SNAPSHOT, hourySnapshot.id, 'burnedUsd', '0.0000000000000005373800000000000000000309208452');
            });
        });
    });
});
