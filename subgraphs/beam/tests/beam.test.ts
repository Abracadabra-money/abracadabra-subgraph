import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly';
import { createSendToChain } from './helpers/create-send-to-chain';
import { createReceiveToChain } from './helpers/create-receive-from-chain';
import { BEAM_DAILY_SNAPSHOT_ENTITY, BEAM_ENTITY, BEAM_HOURY_SNAPSHOT_ENTITY, BEAM_RECEIVE_ENTITY, BEAM_SEND_TX_ENTITY } from './constants';
import { BigInt } from '@graphprotocol/graph-ts';
import { bigIntToBigDecimal, ZERO_ADDRESS } from 'misc';
import { handleReceiveFromChain, handleSendToChain } from '../src/mappings/beam';
import { BEAM_ADDRESS } from '../src/constants';
import { getOrCreateBeamDailySnapshot } from '../src/helpers/get-or-create-beam-daily-snapshot';
import { getOrCreateBeamHourySnapshot } from '../src/helpers/get-or-create-beam-houry-snapshot';

describe('Beam', () => {
    describe('handleSendToChain', () => {
        beforeEach(() => {
            clearStore();
        });

        test('should create send tx', () => {
            const chainId = 1;
            const amount = BigInt.fromI32(10000000);

            const log = createSendToChain(chainId, amount);

            handleSendToChain(log);

            assert.entityCount(BEAM_SEND_TX_ENTITY, 1);
            assert.fieldEquals(BEAM_SEND_TX_ENTITY, log.transaction.hash.toHexString(), 'beam', BEAM_ADDRESS);
            assert.fieldEquals(BEAM_SEND_TX_ENTITY, log.transaction.hash.toHexString(), 'dstChainId', chainId.toString());
            assert.fieldEquals(BEAM_SEND_TX_ENTITY, log.transaction.hash.toHexString(), 'from', ZERO_ADDRESS);
            assert.fieldEquals(BEAM_SEND_TX_ENTITY, log.transaction.hash.toHexString(), 'to', ZERO_ADDRESS);
            assert.fieldEquals(BEAM_SEND_TX_ENTITY, log.transaction.hash.toHexString(), 'amount', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(BEAM_SEND_TX_ENTITY, log.transaction.hash.toHexString(), 'blockNumber', log.block.number.toString());
            assert.fieldEquals(BEAM_SEND_TX_ENTITY, log.transaction.hash.toHexString(), 'timestamp', log.block.timestamp.toString());
        });

        test('should update beam entity', () => {
            const chainId = 1;
            const amount = BigInt.fromI32(10000000);

            const log = createSendToChain(chainId, amount);

            handleSendToChain(log);

            assert.entityCount(BEAM_ENTITY, 1);
            assert.fieldEquals(BEAM_ENTITY, BEAM_ADDRESS, 'volume', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(BEAM_ENTITY, BEAM_ADDRESS, 'sendCount', '1');
            assert.fieldEquals(BEAM_ENTITY, BEAM_ADDRESS, 'sendVolume', bigIntToBigDecimal(amount).toString());
        });

        test('should update daily snapshot', () => {
            const chainId = 1;
            const amount = BigInt.fromI32(10000000);

            const log = createSendToChain(chainId, amount);

            handleSendToChain(log);

            const dailySnapshot = getOrCreateBeamDailySnapshot(log.block);

            assert.entityCount(BEAM_ENTITY, 1);
            assert.fieldEquals(BEAM_DAILY_SNAPSHOT_ENTITY, dailySnapshot.id, 'volume', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(BEAM_DAILY_SNAPSHOT_ENTITY, dailySnapshot.id, 'sendCount', '1');
            assert.fieldEquals(BEAM_DAILY_SNAPSHOT_ENTITY, dailySnapshot.id, 'sendVolume', bigIntToBigDecimal(amount).toString());
        });

        test('should update houry snapshot', () => {
            const chainId = 1;
            const amount = BigInt.fromI32(10000000);

            const log = createSendToChain(chainId, amount);

            handleSendToChain(log);

            const hourySnapshot = getOrCreateBeamHourySnapshot(log.block);

            assert.entityCount(BEAM_ENTITY, 1);
            assert.fieldEquals(BEAM_HOURY_SNAPSHOT_ENTITY, hourySnapshot.id, 'volume', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(BEAM_HOURY_SNAPSHOT_ENTITY, hourySnapshot.id, 'sendCount', '1');
            assert.fieldEquals(BEAM_HOURY_SNAPSHOT_ENTITY, hourySnapshot.id, 'sendVolume', bigIntToBigDecimal(amount).toString());
        });
    });

    describe('handleReceiveFromChain', () => {
        beforeEach(() => {
            clearStore();
        });

        test('should create send tx', () => {
            const chainId = 1;
            const amount = BigInt.fromI32(10000000);

            const log = createReceiveToChain(chainId, amount);

            handleReceiveFromChain(log);

            assert.entityCount(BEAM_RECEIVE_ENTITY, 1);
            assert.fieldEquals(BEAM_RECEIVE_ENTITY, log.transaction.hash.toHexString(), 'beam', BEAM_ADDRESS);
            assert.fieldEquals(BEAM_RECEIVE_ENTITY, log.transaction.hash.toHexString(), 'srcChainId', chainId.toString());
            assert.fieldEquals(BEAM_RECEIVE_ENTITY, log.transaction.hash.toHexString(), 'to', ZERO_ADDRESS);
            assert.fieldEquals(BEAM_RECEIVE_ENTITY, log.transaction.hash.toHexString(), 'amount', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(BEAM_RECEIVE_ENTITY, log.transaction.hash.toHexString(), 'blockNumber', log.block.number.toString());
            assert.fieldEquals(BEAM_RECEIVE_ENTITY, log.transaction.hash.toHexString(), 'timestamp', log.block.timestamp.toString());
        });

        test('should update beam entity', () => {
            const chainId = 1;
            const amount = BigInt.fromI32(10000000);

            const log = createReceiveToChain(chainId, amount);

            handleReceiveFromChain(log);

            assert.entityCount(BEAM_ENTITY, 1);
            assert.fieldEquals(BEAM_ENTITY, BEAM_ADDRESS, 'volume', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(BEAM_ENTITY, BEAM_ADDRESS, 'receiveCount', '1');
            assert.fieldEquals(BEAM_ENTITY, BEAM_ADDRESS, 'receiveVolume', bigIntToBigDecimal(amount).toString());
        });

        test('should update daily snapshot', () => {
            const chainId = 1;
            const amount = BigInt.fromI32(10000000);

            const log = createReceiveToChain(chainId, amount);

            handleReceiveFromChain(log);

            const dailySnapshot = getOrCreateBeamDailySnapshot(log.block);

            assert.entityCount(BEAM_ENTITY, 1);
            assert.fieldEquals(BEAM_DAILY_SNAPSHOT_ENTITY, dailySnapshot.id, 'volume', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(BEAM_DAILY_SNAPSHOT_ENTITY, dailySnapshot.id, 'receiveCount', '1');
            assert.fieldEquals(BEAM_DAILY_SNAPSHOT_ENTITY, dailySnapshot.id, 'receiveVolume', bigIntToBigDecimal(amount).toString());
        });

        test('should update houry snapshot', () => {
            const chainId = 1;
            const amount = BigInt.fromI32(10000000);

            const log = createReceiveToChain(chainId, amount);

            handleReceiveFromChain(log);

            const hourySnapshot = getOrCreateBeamHourySnapshot(log.block);

            assert.entityCount(BEAM_ENTITY, 1);
            assert.fieldEquals(BEAM_HOURY_SNAPSHOT_ENTITY, hourySnapshot.id, 'volume', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(BEAM_HOURY_SNAPSHOT_ENTITY, hourySnapshot.id, 'receiveCount', '1');
            assert.fieldEquals(BEAM_HOURY_SNAPSHOT_ENTITY, hourySnapshot.id, 'receiveVolume', bigIntToBigDecimal(amount).toString());
        });
    });
});
