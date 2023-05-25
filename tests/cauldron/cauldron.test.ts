import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { afterEach, assert, beforeEach, clearStore, createMockedFunction, describe, test } from 'matchstick-as';
import { createCauldron, getCauldron, getOrCreateFinancialCauldronMetricsDailySnapshot } from '../../src/helpers/cauldron';
import {
    CLONE_ADDRESS,
    BLOCK_NUMBER,
    BLOCK_TIMESTAMP,
    COLLATERAL_DECIMALS,
    COLLATERAL_NAME,
    COLLATERAL_SYMBOL,
    MOCK_ACCOUNT,
    FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT,
    FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT,
    CAULDRON_ENTITY_TYPE,
    NON_CAULDRON_V1_COLLATERAL_ADDRESS,
    NON_CAULDRON_V1_DATA,
    NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS,
} from '../constants';
import { handleBorrowCall, handleCookCall, handleLiquidateCall, handleLogAccrue } from '../../src/mappings/cauldron';

import { getOrCreateAccount, getOrCreateAccountState } from '../../src/helpers/account';
import { getOrCreateFinancialProtocolMetricsDailySnapshot } from '../../src/helpers/protocol';
import { createBorrowCall, createBorrowCookCall, createLiquidateCall, createLogAccrueEvent } from './cauldron-utils';

describe('Mock contract functions', () => {
    beforeEach(() => {
        // Create cauldron mock functions
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

        createCauldron(CLONE_ADDRESS, NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, NON_CAULDRON_V1_DATA);
    });

    afterEach(() => {
        clearStore();
    });

    test('Can get fee from borrow call', () => {
        const call = createBorrowCall();

        handleBorrowCall(call);

        const protocolDailySnapshotId = getOrCreateFinancialProtocolMetricsDailySnapshot(call.block).id;
        assert.entityCount(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'feesGenerated', '0.000000000000005');
        assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'borrowFeesGenerated', '0.000000000000005');

        const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
        const cauldronDailySnapshotId = getOrCreateFinancialCauldronMetricsDailySnapshot(cauldron, call.block).id;
        assert.entityCount(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'feesGenerated', '0.000000000000005');
        assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'borrowFeesGenerated', '0.000000000000005');
    });

    test('Can get fee from cook call', () => {
        const call = createBorrowCookCall();

        handleCookCall(call);

        const protocolDailySnapshotId = getOrCreateFinancialProtocolMetricsDailySnapshot(call.block).id;
        assert.entityCount(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'feesGenerated', '0.92');
        assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'borrowFeesGenerated', '0.92');

        const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
        const cauldronDailySnapshotId = getOrCreateFinancialCauldronMetricsDailySnapshot(cauldron, call.block).id;
        assert.entityCount(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'feesGenerated', '0.92');
        assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'borrowFeesGenerated', '0.92');
    });

    test('Can get fee from liquidate call', () => {
        createMockedFunction(CLONE_ADDRESS, 'totalBorrow', 'totalBorrow():(uint128,uint128)')
            .withArgs([])
            .returns([
                ethereum.Value.fromSignedBigInt(BigInt.fromString('129610312857873195997422')),
                ethereum.Value.fromSignedBigInt(BigInt.fromString('128738636647416303818160')),
            ]);

        const call = createLiquidateCall();

        const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

        const account = getOrCreateAccount(cauldron, MOCK_ACCOUNT.toHexString(), call.block);
        const accountState = getOrCreateAccountState(cauldron, account);

        accountState.borrowPart = BigInt.fromString('1200700756276012022289');
        accountState.save();

        handleLiquidateCall(call);

        const protocolDailySnapshotId = getOrCreateFinancialProtocolMetricsDailySnapshot(call.block).id;
        assert.entityCount(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'feesGenerated', '12.088305789336019234');
        assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'liquidationFeesGenerated', '12.088305789336019234');

        const cauldronDailySnapshotId = getOrCreateFinancialCauldronMetricsDailySnapshot(cauldron, call.block).id;
        assert.entityCount(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'feesGenerated', '12.088305789336019234');
        assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'liquidationFeesGenerated', '12.088305789336019234');
    });
});

describe('Mocked Events', () => {
    beforeEach(() => {
        // Create cauldron mock functions
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

        createCauldron(CLONE_ADDRESS, NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, NON_CAULDRON_V1_DATA);
    });

    afterEach(() => {
        clearStore();
    });

    test('LogAccrue', () => {
        const newLogAccrueEvent = createLogAccrueEvent();

        handleLogAccrue(newLogAccrueEvent);

        const protocolDailySnapshotId = getOrCreateFinancialProtocolMetricsDailySnapshot(newLogAccrueEvent.block).id;
        assert.entityCount(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'feesGenerated', '0.000000000001');
        assert.fieldEquals(FINANCIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'interestFeesGenerated', '0.000000000001');

        const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
        const cauldronDailySnapshotId = getOrCreateFinancialCauldronMetricsDailySnapshot(cauldron, newLogAccrueEvent.block).id;
        assert.entityCount(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'feesGenerated', '0.000000000001');
        assert.fieldEquals(FINANCIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'interestFeesGenerated', '0.000000000001');

        assert.fieldEquals(CAULDRON_ENTITY_TYPE, cauldron.id, 'isActive', 'true');
    });
});
