import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { afterAll, afterEach, assert, beforeAll, beforeEach, clearStore, createMockedFunction, describe, newMockCall, test } from 'matchstick-as';
import { createCauldron, getCauldron, getOrCreateFinanceialCauldronMetricsDailySnapshot } from '../../src/helpers/cauldron';
import {
    CLONE_ADDRESS,
    BLOCK_NUMBER,
    BLOCK_TIMESTAMP,
    DATA,
    COLLATERAL_ADDRESS,
    COLLATERAL_DECIMALS,
    COLLATERAL_NAME,
    COLLATERAL_SYMBOL,
    MOCK_ACCOUNT,
    MOCK_COOK_BORROW,
    FINANCEIAL_CAULDRON_METRICS_DAILY_SNAPSHOT,
    FINANCEIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT,
} from '../constants';
import { handleBorrowCall, handleCookCall, handleLiquidateCall } from '../../src/mappings/cauldron';
import { BorrowCall, CookCall, LiquidateCall } from '../../generated/templates/Cauldron/Cauldron';
import { ACTION_BORROW } from '../../src/constants';
import { getOrCreateAccount, getOrCreateAccountState } from '../../src/helpers/account';
import { getOrCreateFinanceialProtocolMetricsDailySnapshot } from '../../src/helpers/protocol';

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
        createMockedFunction(COLLATERAL_ADDRESS, 'symbol', 'symbol():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_SYMBOL)]);
        createMockedFunction(COLLATERAL_ADDRESS, 'name', 'name():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_NAME)]);
        createMockedFunction(COLLATERAL_ADDRESS, 'decimals', 'decimals():(uint8)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(COLLATERAL_DECIMALS)]);

        createCauldron(CLONE_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, DATA);
    });

    afterEach(() => {
        clearStore();
    });

    test('Can get fee from borrow call', () => {
        const call: BorrowCall = changetype<BorrowCall>(newMockCall());
        call.to = CLONE_ADDRESS;
        call.inputValues = [new ethereum.EventParam('to', ethereum.Value.fromAddress(MOCK_ACCOUNT)), new ethereum.EventParam('amount', ethereum.Value.fromI32(1000000))];

        handleBorrowCall(call);

        const protocolDailySnapshotId = getOrCreateFinanceialProtocolMetricsDailySnapshot(call.block).id;
        assert.entityCount(FINANCEIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCEIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'feesGenerated', '0.000000000000005');
        assert.fieldEquals(FINANCEIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'borrowFeesGenerated', '0.000000000000005');

        const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
        const cauldronDailySnapshotId = getOrCreateFinanceialCauldronMetricsDailySnapshot(cauldron, call.block).id;
        assert.entityCount(FINANCEIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCEIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'feesGenerated', '0.000000000000005');
        assert.fieldEquals(FINANCEIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'borrowFeesGenerated', '0.000000000000005');
    });

    test('Can get fee from cook call', () => {
        const call: CookCall = changetype<CookCall>(newMockCall());
        call.to = CLONE_ADDRESS;
        call.inputValues = [
            new ethereum.EventParam('actions', ethereum.Value.fromArray([ethereum.Value.fromI32(ACTION_BORROW)])),
            new ethereum.EventParam('values', ethereum.Value.fromArray([ethereum.Value.fromI32(0)])),
            new ethereum.EventParam('datas', ethereum.Value.fromArray([ethereum.Value.fromBytes(MOCK_COOK_BORROW)])),
        ];

        handleCookCall(call);

        const protocolDailySnapshotId = getOrCreateFinanceialProtocolMetricsDailySnapshot(call.block).id;
        assert.entityCount(FINANCEIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCEIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'feesGenerated', '0.92');
        assert.fieldEquals(FINANCEIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'borrowFeesGenerated', '0.92');

        const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
        const cauldronDailySnapshotId = getOrCreateFinanceialCauldronMetricsDailySnapshot(cauldron, call.block).id;
        assert.entityCount(FINANCEIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCEIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'feesGenerated', '0.92');
        assert.fieldEquals(FINANCEIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'borrowFeesGenerated', '0.92');
    });

    test('Can get fee from liquidate call', () => {
        createMockedFunction(CLONE_ADDRESS, 'totalBorrow', 'totalBorrow():(uint128,uint128)')
            .withArgs([])
            .returns([
                ethereum.Value.fromSignedBigInt(BigInt.fromString('129610312857873195997422')),
                ethereum.Value.fromSignedBigInt(BigInt.fromString('128738636647416303818160')),
            ]);

        const call: LiquidateCall = changetype<LiquidateCall>(newMockCall());
        call.to = CLONE_ADDRESS;
        call.inputValues = [
            new ethereum.EventParam('users', ethereum.Value.fromArray([ethereum.Value.fromAddress(MOCK_ACCOUNT)])),
            new ethereum.EventParam('maxBorrowParts', ethereum.Value.fromArray([ethereum.Value.fromSignedBigInt(BigInt.fromString('1200700756276012022288'))])),
            new ethereum.EventParam('to', ethereum.Value.fromAddress(MOCK_ACCOUNT)),
        ];

        const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

        const account = getOrCreateAccount(cauldron, MOCK_ACCOUNT.toHexString(), call.block);
        const accountState = getOrCreateAccountState(cauldron, account);

        accountState.borrowPart = BigInt.fromString('1200700756276012022289');
        accountState.save();

        handleLiquidateCall(call);

        const protocolDailySnapshotId = getOrCreateFinanceialProtocolMetricsDailySnapshot(call.block).id;
        assert.entityCount(FINANCEIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCEIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'feesGenerated', '12.088305789336019234');
        assert.fieldEquals(FINANCEIAL_PROTOCOL_METRICS_DAILY_SNAPSHOT, protocolDailySnapshotId, 'liquidationFeesGenerated', '12.088305789336019234');

        const cauldronDailySnapshotId = getOrCreateFinanceialCauldronMetricsDailySnapshot(cauldron, call.block).id;
        assert.entityCount(FINANCEIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, 1);
        assert.fieldEquals(FINANCEIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'feesGenerated', '12.088305789336019234');
        assert.fieldEquals(FINANCEIAL_CAULDRON_METRICS_DAILY_SNAPSHOT, cauldronDailySnapshotId, 'liquidationFeesGenerated', '12.088305789336019234');
    });
});
