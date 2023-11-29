import { BigDecimal, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, createMockedFunction, describe, test } from 'matchstick-as';
import { createCauldron, getCauldron, getOrCreateCauldronDailySnapshot, getOrCreateCauldronHourySnapshot } from '../src/helpers/cauldron';
import {
    CLONE_ADDRESS,
    BLOCK_NUMBER,
    BLOCK_TIMESTAMP,
    COLLATERAL_DECIMALS,
    COLLATERAL_NAME,
    COLLATERAL_SYMBOL,
    CAULDRON_ENTITY,
    NON_CAULDRON_V1_COLLATERAL_ADDRESS,
    NON_CAULDRON_V1_DATA,
    NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS,
    COLLATERAL_ENTITY,
    CAULDRON_V1_COLLATERAL_ADDRESS,
    PROTOCOL_ENTITY,
    MOCK_ACCOUNT,
    ACCOUNT_ENTITY,
    ACCOUNT_STATE_ENTITY,
    ACCOUNT_STATE_SNAPSHOT_ENTITY,
    CAULDRON_DAILY_SNAPSHOT_ENTITY,
    CAULDRON_HOURY_SNAPSHOT_ENTITY,
    PROTOCOL_DAILY_SNAPSHOT_ENTITY,
    PROTOCOL_HOURY_SNAPSHOT_ENTITY,
    COLLATERAL_DAILY_SNAPSHOT_ENTITY,
    COLLATERAL_HOURY_SNAPSHOT_ENTITY,
} from './constants';
import { handleLogAccrue, handleLogExchangeRate, handleLogAddCollateral, handleLogRemoveCollateral, handleLogBorrow, handleLogRepay } from '../src/mappings/cauldron';

import { getOrCreateProtocol, getOrCreateProtocolDailySnapshot, getOrCreateProtocolHourySnapshot } from '../src/helpers/protocol';
import { createLogAccrue } from './helpers/create-log-accrue';
import { bigIntToBigDecimal } from 'misc';
import { createLogExchangeRate } from './helpers/create-log-exchange-rate';
import { createLogAddCollateral } from './helpers/create-log-add-collateral';
import { createLogRemoveCollateral } from './helpers/create-log-remove-collateral';
import { createLogBorrow } from './helpers/create-log-borrow';
import { createLogRepay } from './helpers/create-log-repay';
import { getOrCreateCollateral, getOrCreateCollateralDailySnapshot, getOrCreateCollateralHourySnapshot } from '../src/helpers/collateral';
import { getOrCreateAccount, getOrCreateAccountState, getOrCreateAccountStateSnapshot } from '../src/helpers/account';

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

        createMockedFunction(CAULDRON_V1_COLLATERAL_ADDRESS, 'symbol', 'symbol():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_SYMBOL)]);

        createMockedFunction(CAULDRON_V1_COLLATERAL_ADDRESS, 'name', 'name():(string)')
            .withArgs([])
            .returns([ethereum.Value.fromString(COLLATERAL_NAME)]);

        createMockedFunction(CAULDRON_V1_COLLATERAL_ADDRESS, 'decimals', 'decimals():(uint8)')
            .withArgs([])
            .returns([ethereum.Value.fromI32(COLLATERAL_DECIMALS)]);
    });

    describe('handleLogAddCollateral', () => {
        beforeEach(() => {
            clearStore();

            createCauldron(CLONE_ADDRESS, NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, NON_CAULDRON_V1_DATA);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            cauldron.collateralPriceUsd = BigDecimal.fromString('0.00057910000000000000000029296669');
            cauldron.save();
        });

        test('should update cauldron', () => {
            const log = createLogAddCollateral();

            handleLogAddCollateral(log);

            const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'lastActive', log.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'isActive', 'true');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'dailySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'hourySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'totalCollateralShare', '30658.46823487');
        });

        test('should update cauldron daily snapshot', () => {
            const log = createLogAddCollateral();

            handleLogAddCollateral(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronDailySnapshotId = getOrCreateCauldronDailySnapshot(cauldron, log.block).id;
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'totalValueLockedUsd', '17.75431895481321700000898190995924');
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'totalCollateralShare', '30658.46823487');
        });

        test('should update cauldron houry snapshot', () => {
            const log = createLogAddCollateral();

            handleLogAddCollateral(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronHourySnapshotId = getOrCreateCauldronHourySnapshot(cauldron, log.block).id;
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'totalValueLockedUsd', '17.75431895481321700000898190995924');
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'totalCollateralShare', '30658.46823487');
        });

        test('should update protocol', () => {
            const log = createLogAddCollateral();

            handleLogAddCollateral(log);

            const protocolId = getOrCreateProtocol().id!;
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'dailySnapshotCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'hourySnapshotCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalValueLockedUsd', '17.75431895481321700000898190995924');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'cumulativeUniqueUsers', '1');
        });

        test('should update protocol daily snapshot', () => {
            const log = createLogAddCollateral();

            handleLogAddCollateral(log);

            const protocolDailySnapshotId = getOrCreateProtocolDailySnapshot(log.block).id;
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'totalValueLockedUsd', '17.75431895481321700000898190995924');
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'cumulativeUniqueUsers', '1');
        });

        test('should update protocol houry snapshot', () => {
            const log = createLogAddCollateral();

            handleLogAddCollateral(log);

            const protocolHourySnapshotId = getOrCreateProtocolHourySnapshot(log.block).id;
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'totalValueLockedUsd', '17.75431895481321700000898190995924');
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'cumulativeUniqueUsers', '1');
        });

        test('should update account state', () => {
            const log = createLogAddCollateral();

            handleLogAddCollateral(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            const account = getOrCreateAccount(cauldron, MOCK_ACCOUNT.toHexString(), log.block);
            const accountState = getOrCreateAccountState(cauldron, account);
            const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, log.block, log.transaction);

            assert.fieldEquals(ACCOUNT_STATE_ENTITY, accountState.id, 'collateralShare', '30658468234870000000000');
            assert.fieldEquals(ACCOUNT_STATE_ENTITY, accountState.id, 'lastAction', snapshot.id);
        });

        test('should update account state snapshot', () => {
            const log = createLogAddCollateral();

            handleLogAddCollateral(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            const account = getOrCreateAccount(cauldron, MOCK_ACCOUNT.toHexString(), log.block);
            const accountState = getOrCreateAccountState(cauldron, account);
            const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, log.block, log.transaction);

            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'liquidationPrice', '0');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'borrowPart', '0');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'collateralShare', '30658468234870000000000');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'collateralPriceUsd', '0.00057910000000000000000029296669');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'isLiquidated', 'false');
        });
    });

    describe('handleLogRemoveCollateral', () => {
        beforeEach(() => {
            clearStore();

            createCauldron(CLONE_ADDRESS, NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, NON_CAULDRON_V1_DATA);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            cauldron.collateralPriceUsd = BigDecimal.fromString('0.00057910000000000000000029296669');
            cauldron.save();

            const collateral = getOrCreateCollateral(NON_CAULDRON_V1_COLLATERAL_ADDRESS);
            collateral.lastPriceUsd = BigDecimal.fromString('0.00057910000000000000000029296669');
            collateral.save();
        });

        test('should update cauldron', () => {
            const log = createLogRemoveCollateral();

            handleLogRemoveCollateral(log);

            const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'lastActive', log.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'isActive', 'true');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'dailySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'hourySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'totalCollateralShare', '-30658.46823487');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'liquidationAmountUsd', '17.75431895481321700000898190995924');
        });

        test('should update cauldron daily snapshot', () => {
            const log = createLogRemoveCollateral();

            handleLogRemoveCollateral(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronDailySnapshotId = getOrCreateCauldronDailySnapshot(cauldron, log.block).id;
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'totalValueLockedUsd', '-17.75431895481321700000898190995924');
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'totalCollateralShare', '-30658.46823487');
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'liquidationAmountUsd', '17.75431895481321700000898190995924');
        });

        test('should update cauldron houry snapshot', () => {
            const log = createLogRemoveCollateral();

            handleLogRemoveCollateral(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronHourySnapshotId = getOrCreateCauldronHourySnapshot(cauldron, log.block).id;
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'totalValueLockedUsd', '-17.75431895481321700000898190995924');
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'totalCollateralShare', '-30658.46823487');
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'liquidationAmountUsd', '17.75431895481321700000898190995924');
        });

        test('should update protocol', () => {
            const log = createLogRemoveCollateral();

            handleLogRemoveCollateral(log);

            const protocolId = getOrCreateProtocol().id!;
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'dailySnapshotCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'hourySnapshotCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalValueLockedUsd', '-17.75431895481321700000898190995924');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'liquidationAmountUsd', '17.75431895481321700000898190995924');
        });

        test('should update protocol daily snapshot', () => {
            const log = createLogRemoveCollateral();

            handleLogRemoveCollateral(log);

            const protocolDailySnapshotId = getOrCreateProtocolDailySnapshot(log.block).id;
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'totalValueLockedUsd', '-17.75431895481321700000898190995924');
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'liquidationAmountUsd', '17.75431895481321700000898190995924');
        });

        test('should update protocol houry snapshot', () => {
            const log = createLogRemoveCollateral();

            handleLogRemoveCollateral(log);

            const protocolHourySnapshotId = getOrCreateProtocolHourySnapshot(log.block).id;
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'totalValueLockedUsd', '-17.75431895481321700000898190995924');
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'liquidationAmountUsd', '17.75431895481321700000898190995924');
        });

        test('should update account state', () => {
            const log = createLogRemoveCollateral();

            handleLogRemoveCollateral(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            const account = getOrCreateAccount(cauldron, MOCK_ACCOUNT.toHexString(), log.block);
            const accountState = getOrCreateAccountState(cauldron, account);
            const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, log.block, log.transaction);

            assert.fieldEquals(ACCOUNT_STATE_ENTITY, accountState.id, 'collateralShare', '-30658468234870000000000');
            assert.fieldEquals(ACCOUNT_STATE_ENTITY, accountState.id, 'lastAction', snapshot.id);
        });

        test('should update account state snapshot', () => {
            const log = createLogRemoveCollateral();

            handleLogRemoveCollateral(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            const account = getOrCreateAccount(cauldron, MOCK_ACCOUNT.toHexString(), log.block);
            const accountState = getOrCreateAccountState(cauldron, account);
            const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, log.block, log.transaction);

            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'liquidationPrice', '0');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'borrowPart', '0');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'collateralShare', '-30658468234870000000000');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'collateralPriceUsd', '0.00057910000000000000000029296669');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'isLiquidated', 'true');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'withdrawAmount', '30658468234870000000000');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'withdrawAmountUsd', '17.75431895481321700000898190995924');
        });
    });

    describe('handleLogBorrow', () => {
        beforeEach(() => {
            clearStore();

            createCauldron(CLONE_ADDRESS, NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, NON_CAULDRON_V1_DATA);
        });

        test('should update cauldron', () => {
            const log = createLogBorrow();

            handleLogBorrow(log);

            const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'lastActive', log.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'isActive', 'true');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'dailySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'hourySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'totalMimBorrowed', '225.840586805430596628');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'borrowFeesGenerated', '1.1347523298321543450099502487562');
        });

        test('should update cauldron daily snapshot', () => {
            const log = createLogBorrow();

            handleLogBorrow(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronDailySnapshotId = getOrCreateCauldronDailySnapshot(cauldron, log.block).id;

            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'totalMimBorrowed', '225.840586805430596628');
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'borrowFeesGenerated', '1.1347523298321543450099502487562');
        });

        test('should update cauldron houry snapshot', () => {
            const log = createLogBorrow();

            handleLogBorrow(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronHourySnapshotId = getOrCreateCauldronHourySnapshot(cauldron, log.block).id;

            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'totalMimBorrowed', '225.840586805430596628');
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'borrowFeesGenerated', '1.1347523298321543450099502487562');
        });

        test('should update protocol', () => {
            const log = createLogBorrow();

            handleLogBorrow(log);

            const protocolId = getOrCreateProtocol().id!;
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'dailySnapshotCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'hourySnapshotCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalMimBorrowed', '225.840586805430596628');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'borrowFeesGenerated', '1.1347523298321543450099502487562');
        });

        test('should update protocol daily snapshot', () => {
            const log = createLogBorrow();

            handleLogBorrow(log);

            const protocolDailySnapshotId = getOrCreateProtocolDailySnapshot(log.block).id;
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'totalMimBorrowed', '225.840586805430596628');
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'borrowFeesGenerated', '1.1347523298321543450099502487562');
        });

        test('should update protocol houry snapshot', () => {
            const log = createLogBorrow();

            handleLogBorrow(log);

            const protocolHourySnapshotId = getOrCreateProtocolHourySnapshot(log.block).id;
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'totalMimBorrowed', '225.840586805430596628');
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'borrowFeesGenerated', '1.1347523298321543450099502487562');
        });

        test('should update account state', () => {
            const log = createLogBorrow();

            handleLogBorrow(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            const account = getOrCreateAccount(cauldron, MOCK_ACCOUNT.toHexString(), log.block);
            const accountState = getOrCreateAccountState(cauldron, account);
            const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, log.block, log.transaction);

            assert.fieldEquals(ACCOUNT_STATE_ENTITY, accountState.id, 'borrowPart', '225840586805430596628');
            assert.fieldEquals(ACCOUNT_STATE_ENTITY, accountState.id, 'lastAction', snapshot.id);
        });

        test('should update account state snapshot', () => {
            const log = createLogBorrow();

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            const account = getOrCreateAccount(cauldron, MOCK_ACCOUNT.toHexString(), log.block);

            const accountState = getOrCreateAccountState(cauldron, account);
            accountState.collateralShare = BigInt.fromString('30658468234870000000000');
            accountState.save();

            const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, log.block, log.transaction);

            handleLogBorrow(log);

            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'borrowPart', '225840586805430596628');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'isLiquidated', 'false');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'liquidationPrice', '0.009207920348274545015940053237694711');
        });
    });

    describe('handleLogRepay', () => {
        beforeEach(() => {
            clearStore();

            createCauldron(CLONE_ADDRESS, NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, NON_CAULDRON_V1_DATA);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            cauldron.collateralPriceUsd = BigDecimal.fromString('0.00057910000000000000000029296669');
            cauldron.save();
        });

        test('should update cauldron', () => {
            const log = createLogRepay();

            handleLogRepay(log);

            const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'lastActive', log.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'isActive', 'true');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'dailySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'hourySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'totalMimBorrowed', '-20099.969255386734545224');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'liquidationFeesGenerated', '201.035617312679142954');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'repaidAmount', '20099.969255386734545224');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'liquidationCount', '1');
        });

        test('should update cauldron daily snapshot', () => {
            const log = createLogRepay();

            handleLogRepay(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronDailySnapshotId = getOrCreateCauldronDailySnapshot(cauldron, log.block).id;

            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'totalMimBorrowed', '-20099.969255386734545224');
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'liquidationFeesGenerated', '201.035617312679142954');
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'repaidAmount', '20099.969255386734545224');
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'liquidationCount', '1');
        });

        test('should update cauldron houry snapshot', () => {
            const log = createLogRepay();

            handleLogRepay(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronHourySnapshotId = getOrCreateCauldronHourySnapshot(cauldron, log.block).id;

            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'totalMimBorrowed', '-20099.969255386734545224');
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'liquidationFeesGenerated', '201.035617312679142954');
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'repaidAmount', '20099.969255386734545224');
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'liquidationCount', '1');
        });

        test('should update protocol', () => {
            const log = createLogRepay();

            handleLogRepay(log);

            const protocolId = getOrCreateProtocol().id!;
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'dailySnapshotCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'hourySnapshotCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalMimBorrowed', '-20099.969255386734545224');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'liquidationFeesGenerated', '201.035617312679142954');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'repaidAmount', '20099.969255386734545224');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'liquidationCount', '1');
        });

        test('should update protocol daily snapshot', () => {
            const log = createLogRepay();

            handleLogRepay(log);

            const protocolDailySnapshotId = getOrCreateProtocolDailySnapshot(log.block).id;
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'totalMimBorrowed', '-20099.969255386734545224');
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'liquidationFeesGenerated', '201.035617312679142954');
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'repaidAmount', '20099.969255386734545224');
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'liquidationCount', '1');
        });

        test('should update protocol houry snapshot', () => {
            const log = createLogRepay();

            handleLogRepay(log);

            const protocolHourySnapshotId = getOrCreateProtocolHourySnapshot(log.block).id;
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'totalMimBorrowed', '-20099.969255386734545224');
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'cumulativeUniqueUsers', '1');
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'liquidationFeesGenerated', '201.035617312679142954');
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'repaidAmount', '20099.969255386734545224');
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'liquidationCount', '1');
        });

        test('should update account', () => {
            const log = createLogRepay();

            handleLogRepay(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            const account = getOrCreateAccount(cauldron, MOCK_ACCOUNT.toHexString(), log.block);
            assert.fieldEquals(ACCOUNT_ENTITY, account.id, 'liquidationCount', '1');
        })

        test('should update account state', () => {
            const log = createLogRepay();

            handleLogRepay(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            const account = getOrCreateAccount(cauldron, MOCK_ACCOUNT.toHexString(), log.block);
            const accountState = getOrCreateAccountState(cauldron, account);
            const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, log.block, log.transaction);

            assert.fieldEquals(ACCOUNT_STATE_ENTITY, accountState.id, 'borrowPart', '-20099969255386734545224');
            assert.fieldEquals(ACCOUNT_STATE_ENTITY, accountState.id, 'lastAction', snapshot.id);
        });

        test('should update account state snapshot', () => {
            const log = createLogRepay();

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            const account = getOrCreateAccount(cauldron, MOCK_ACCOUNT.toHexString(), log.block);

            const accountState = getOrCreateAccountState(cauldron, account);
            accountState.collateralShare = BigInt.fromString('140099969255386734545224');
            accountState.borrowPart = BigInt.fromString('40099969255386734545224');
            accountState.save();

            const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, log.block, log.transaction);

            handleLogRepay(log);

            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'borrowPart', '20000000000000000000000');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'isLiquidated', 'true');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'liquidationPrice', '0.178444007752976501806397235832438');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'repaid', '20099969255386734545224');
            assert.fieldEquals(ACCOUNT_STATE_SNAPSHOT_ENTITY, snapshot.id, 'repaidUsd', '20099.969255386734545224');
        });
    });

    describe('LogExchangeRate', () => {
        beforeEach(() => {
            clearStore();

            createCauldron(CLONE_ADDRESS, NON_CAULDRON_V1_MASTER_CONTRACT_ADDRESS, BLOCK_NUMBER, BLOCK_TIMESTAMP, NON_CAULDRON_V1_DATA);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;
            cauldron.totalCollateralShare = BigDecimal.fromString('10000');
            cauldron.save();
        });

        test('should update cauldron', () => {
            const amount = BigInt.fromString('1726817475392850975651');
            const log = createLogExchangeRate(amount);

            handleLogExchangeRate(log);

            const cauldronId = getCauldron(CLONE_ADDRESS.toHexString())!.id;
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'lastActive', log.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'isActive', 'true');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'deprecated', 'false');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'exchangeRate', amount.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'dailySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'hourySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'collateralPriceUsd', '0.00057910000000000000000029296669');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'totalValueLockedUsd', '5.7910000000000000000029296669');
        });

        test('should update cauldron daily snapshot', () => {
            const amount = BigInt.fromString('1726817475392850975651');
            const log = createLogExchangeRate(amount);

            handleLogExchangeRate(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronDailySnapshotId = getOrCreateCauldronDailySnapshot(cauldron, log.block).id;
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'totalValueLockedUsd', '5.7910000000000000000029296669');
        });

        test('should update cauldron houry snapshot', () => {
            const amount = BigInt.fromString('1726817475392850975651');
            const log = createLogExchangeRate(amount);

            handleLogExchangeRate(log);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronHourySnapshotId = getOrCreateCauldronHourySnapshot(cauldron, log.block).id;
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'totalValueLockedUsd', '5.7910000000000000000029296669');
        });

        test('should update collateral', () => {
            const amount = BigInt.fromString('1726817475392850975651');
            const log = createLogExchangeRate(amount);

            handleLogExchangeRate(log);

            const collateral = getOrCreateCollateral(NON_CAULDRON_V1_COLLATERAL_ADDRESS);
            assert.fieldEquals(COLLATERAL_ENTITY, collateral.id, 'lastPriceUsd', '0.00057910000000000000000029296669');
            assert.fieldEquals(COLLATERAL_ENTITY, collateral.id, 'lastPriceBlockNumber', log.block.number.toString());
            assert.fieldEquals(COLLATERAL_ENTITY, collateral.id, 'lastPriceTimestamp', log.block.timestamp.toString());
        });

        test('should update collateral daily snapshot', () => {
            const amount = BigInt.fromString('1726817475392850975651');
            const log = createLogExchangeRate(amount);

            handleLogExchangeRate(log);

            const collateral = getOrCreateCollateral(NON_CAULDRON_V1_COLLATERAL_ADDRESS);

            const collateralDailySnapshotId = getOrCreateCollateralDailySnapshot(log.block, collateral).id;
            assert.entityCount(COLLATERAL_DAILY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(COLLATERAL_DAILY_SNAPSHOT_ENTITY, collateralDailySnapshotId, 'lastPriceUsd', '0.00057910000000000000000029296669');
        });

        test('should update collateral houry snapshot', () => {
            const amount = BigInt.fromString('1726817475392850975651');
            const log = createLogExchangeRate(amount);

            handleLogExchangeRate(log);

            const collateral = getOrCreateCollateral(NON_CAULDRON_V1_COLLATERAL_ADDRESS);

            const collateralHourySnapshotId = getOrCreateCollateralHourySnapshot(log.block, collateral).id;
            assert.entityCount(COLLATERAL_HOURY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(COLLATERAL_HOURY_SNAPSHOT_ENTITY, collateralHourySnapshotId, 'lastPriceUsd', '0.00057910000000000000000029296669');
        });

        test('should update protocol', () => {
            const amount = BigInt.fromString('1726817475392850975651');
            const log = createLogExchangeRate(amount);

            handleLogExchangeRate(log);

            const protocolId = getOrCreateProtocol().id!;
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalValueLockedUsd', '5.7910000000000000000029296669');
        });

        test('should update protocol daily snapshot', () => {
            const amount = BigInt.fromString('1726817475392850975651');
            const log = createLogExchangeRate(amount);

            handleLogExchangeRate(log);

            const protocolDailySnapshotId = getOrCreateProtocolDailySnapshot(log.block).id;
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'totalValueLockedUsd', '5.7910000000000000000029296669');
        });

        test('should update protocol houry snapshot', () => {
            const amount = BigInt.fromString('1726817475392850975651');
            const log = createLogExchangeRate(amount);

            handleLogExchangeRate(log);

            const protocolHourySnapshotId = getOrCreateProtocolHourySnapshot(log.block).id;
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'totalValueLockedUsd', '5.7910000000000000000029296669');
        });
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
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'lastActive', log.block.timestamp.toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'isActive', 'true');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'hourySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'dailySnapshotCount', '1');
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'totalFeesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(CAULDRON_ENTITY, cauldronId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());
        });

        test('should update protocol', () => {
            const amount = BigInt.fromI32(10000000);
            const log = createLogAccrue(amount);

            handleLogAccrue(log);

            const protocolId = getOrCreateProtocol().id!;
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'dailySnapshotCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'hourySnapshotCount', '1');
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'totalFeesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(PROTOCOL_ENTITY, protocolId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());
        });

        test('should update protocol daily snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const newLogAccrueEvent = createLogAccrue(amount);

            handleLogAccrue(newLogAccrueEvent);

            const protocolDailySnapshotId = getOrCreateProtocolDailySnapshot(newLogAccrueEvent.block).id;
            assert.entityCount(PROTOCOL_DAILY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'feesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(PROTOCOL_DAILY_SNAPSHOT_ENTITY, protocolDailySnapshotId, 'totalFeesGenerated', bigIntToBigDecimal(amount).toString());
        });

        test('should update protocol houry snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const newLogAccrueEvent = createLogAccrue(amount);

            handleLogAccrue(newLogAccrueEvent);

            const protocolHourySnapshotId = getOrCreateProtocolHourySnapshot(newLogAccrueEvent.block).id;
            assert.entityCount(PROTOCOL_HOURY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'feesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(PROTOCOL_HOURY_SNAPSHOT_ENTITY, protocolHourySnapshotId, 'totalFeesGenerated', bigIntToBigDecimal(amount).toString());
        });

        test('should update cauldron daily snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const newLogAccrueEvent = createLogAccrue(amount);

            handleLogAccrue(newLogAccrueEvent);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronDailySnapshotId = getOrCreateCauldronDailySnapshot(cauldron, newLogAccrueEvent.block).id;
            assert.entityCount(CAULDRON_DAILY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'feesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(CAULDRON_DAILY_SNAPSHOT_ENTITY, cauldronDailySnapshotId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());
        });

        test('should update cauldron houry snapshot', () => {
            const amount = BigInt.fromI32(10000000);
            const newLogAccrueEvent = createLogAccrue(amount);

            handleLogAccrue(newLogAccrueEvent);

            const cauldron = getCauldron(CLONE_ADDRESS.toHexString())!;

            const cauldronHourySnapshotId = getOrCreateCauldronHourySnapshot(cauldron, newLogAccrueEvent.block).id;
            assert.entityCount(CAULDRON_HOURY_SNAPSHOT_ENTITY, 1);
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'feesGenerated', bigIntToBigDecimal(amount).toString());
            assert.fieldEquals(CAULDRON_HOURY_SNAPSHOT_ENTITY, cauldronHourySnapshotId, 'interestFeesGenerated', bigIntToBigDecimal(amount).toString());
        });
    });
});
