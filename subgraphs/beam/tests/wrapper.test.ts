import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly';
import { createLogWrapperFeeWithdrawn } from './helpers/create-log-wrapper-fee-withdrawn';
import { bigIntToBigDecimal } from 'misc';
import { BigInt } from '@graphprotocol/graph-ts';
import { handleLogWrapperFeeWithdrawn } from '../src/mappings/wrapper';
import { BEAM_ENTITY, BEAM_DAILY_SNAPSHOT_ENTITY, BEAM_HOURY_SNAPSHOT_ENTITY } from './constants';
import { BEAM_ADDRESS } from '../src/constants';
import { getOrCreateBeamDailySnapshot } from '../src/helpers/get-or-create-beam-daily-snapshot';
import { getOrCreateBeamHourySnapshot } from '../src/helpers/get-or-create-beam-houry-snapshot';

describe('OFT Wrapper', () => {
    describe('handleLogWrapperFeeWithdrawn', () => {
        beforeEach(() => {
            clearStore();
        });

        test('should update beam entity', () => {
            const amount = BigInt.fromI32(100000);
            const log = createLogWrapperFeeWithdrawn(amount);

            handleLogWrapperFeeWithdrawn(log);

            assert.entityCount(BEAM_ENTITY, 1);
            assert.fieldEquals(BEAM_ENTITY, BEAM_ADDRESS, 'feesGenerated', bigIntToBigDecimal(amount).toString());
        });

        test('should update dailySnapshot', () => {
            const amount = BigInt.fromI32(100000);
            const log = createLogWrapperFeeWithdrawn(amount);

            handleLogWrapperFeeWithdrawn(log);

            const snapshot = getOrCreateBeamDailySnapshot(log.block);

            assert.entityCount(BEAM_DAILY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(BEAM_DAILY_SNAPSHOT_ENTITY, snapshot.id, 'feesGenerated', bigIntToBigDecimal(amount).toString());
        });

        test('should update hourySnapshot', () => {
            const amount = BigInt.fromI32(100000);
            const log = createLogWrapperFeeWithdrawn(amount);

            handleLogWrapperFeeWithdrawn(log);

            const snapshot = getOrCreateBeamHourySnapshot(log.block);

            assert.entityCount(BEAM_HOURY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(BEAM_HOURY_SNAPSHOT_ENTITY, snapshot.id, 'feesGenerated', bigIntToBigDecimal(amount).toString());
        });
    });
});
