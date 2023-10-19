import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, createMockedFunction, describe, test } from 'matchstick-as';
import { createCauldron, getCauldron, getOrCreateFinancialCauldronMetricsDailySnapshot } from '../src/helpers/cauldron';
import {
    CLONE_ADDRESS,
    BLOCK_NUMBER,
    BLOCK_TIMESTAMP,
    COLLATERAL_DECIMALS,
    COLLATERAL_NAME,
    COLLATERAL_SYMBOL,
    FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT,
    FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT,
    CAULDRON_ENTITY_TYPE,
    NON_CAULDRON_V1_COLLATERAL_ADDRESS,
    NON_CAULDRON_V1_DATA,
    NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS,
    SPELL_ORACLE_ADDRESS,
    SPELL_ORACLE_DATA,
    SPELL_ORACLE_PRICE,
} from './constants';
import { handleLogAccrue, handleLogBorrow } from '../src/mappings/cauldron';

import { getOrCreateFinancialProtocolMetricsDailySnapshot } from '../src/helpers/protocol';
import { createLogBorrow } from './helpers/create-log-borrow';
import { createLogAccrue } from './helpers/create-log-accrue';
import { bigIntToBigDecimal } from 'misc';

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

        createMockedFunction(SPELL_ORACLE_ADDRESS, 'peekSpot', 'peekSpot(bytes):(uint256)')
            .withArgs([ethereum.Value.fromBytes(SPELL_ORACLE_DATA)])
            .returns([ethereum.Value.fromUnsignedBigInt(SPELL_ORACLE_PRICE)]);

        createMockedFunction(CLONE_ADDRESS, 'totalBorrow', 'totalBorrow():(uint128,uint128)')
            .withArgs([])
            .returns([ethereum.Value.fromSignedBigInt(BigInt.fromString('0')), ethereum.Value.fromSignedBigInt(BigInt.fromString('0'))]);
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

        test('LogAccrue', () => {
            const amount = BigInt.fromI32(10000000);
            const newLogAccrueEvent = createLogAccrue(amount);

            handleLogAccrue(newLogAccrueEvent);

            const protocolDailySnapshotId = getOrCreateFinancialProtocolMetricsDailySnapshot(newLogAccrueEvent.block).id;
            assert.entityCount(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, 1);
            assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'feesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            const cauldronDailySnapshotId = getOrCreateFinancialCauldronMetricsDailySnapshot(cauldron, newLogAccrueEvent.block).id;
            assert.entityCount(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, 1);
            assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'feesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());

            assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldron.id, 'isActive', 'true');
        });
    });

    // test('LogBorrow', () => {
    //     const logBorrowEvent = createLogBorrow();

    //     handleLogBorrow(logBorrowEvent);

    //     const protocolDailySnapshotId = getOrCreateFinancialProtocolMetricsDailySnapshot(logBorrowEvent.block).id;
    //     assert.entityCount(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, 1);
    //     assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'feesGenerated', '0.000000000000005');
    //     assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'borrowFeesGenerated', '0.000000000000005');

    //     const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
    //     const cauldronDailySnapshotId = getOrCreateFinancialCauldronMetricsDailySnapshot(cauldron, logBorrowEvent.block).id;
    //     assert.entityCount(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, 1);
    //     assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'feesGenerated', '0.000000000000005');
    //     assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'borrowFeesGenerated', '0.000000000000005');
    // });
});
