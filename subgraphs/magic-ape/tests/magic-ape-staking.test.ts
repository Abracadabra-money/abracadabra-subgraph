import { assert, describe, test, beforeEach, createMockedFunction, clearStore } from 'matchstick-as/assembly';
import { createLogClaimRewards } from './helpers/magic-ape-staking/create-log-claim-rewards';
import { handleLogClaimRewards, handleLogDeposit } from '../src/mappings/magic-ape-staking';
import { MAGIC_APE_ENTITY, MAGIC_APE_DAILY_SNAPSHOT_ENTITY, MAGIC_APE_HOURY_SNAPSHOT_ENTITY } from './constants';
import { DEFAULT_DECIMALS, exponentToBigInt } from 'misc';
import { MAGIC_APE_ADDRESS, MAGIC_APE_STAKING_ADDRESS } from '../src/constants';
import { getOrCreateMagicApeDailySnapshot } from '../src/helpers/get-or-create-magic-ape-daily-snapshot';
import { getOrCreateMagicApeHourySnapshot } from '../src/helpers/get-or-create-magic-ape-houry-snapshot';
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { createLogDeposit } from './helpers/magic-ape-staking/create-log-deposit';

describe('Magic Ape Staking', () => {
    describe('handleLogClaimRewards', () => {
        beforeEach(() => {
            clearStore();
        });

        test('update magic ape entity', () => {
            const log = createLogClaimRewards(exponentToBigInt(DEFAULT_DECIMALS));

            handleLogClaimRewards(log);

            assert.entityCount(MAGIC_APE_ENTITY, 1);
            assert.fieldEquals(MAGIC_APE_ENTITY, MAGIC_APE_ADDRESS, 'totalRewards', '1');
        });

        test('update daily snapshot', () => {
            const log = createLogClaimRewards(exponentToBigInt(DEFAULT_DECIMALS));

            handleLogClaimRewards(log);

            const snapshot = getOrCreateMagicApeDailySnapshot(log.block);

            assert.fieldEquals(MAGIC_APE_DAILY_SNAPSHOT_ENTITY, snapshot.id, 'rewards', '1');
        });

        test('update houry snapshot', () => {
            const log = createLogClaimRewards(exponentToBigInt(DEFAULT_DECIMALS));

            handleLogClaimRewards(log);

            const snapshot = getOrCreateMagicApeHourySnapshot(log.block);

            assert.fieldEquals(MAGIC_APE_HOURY_SNAPSHOT_ENTITY, snapshot.id, 'rewards', '1');
        });
    });

    // describe('handleLogDeposit', () => {
    //     beforeEach(() => {
    //         clearStore();

    //         createMockedFunction(Address.fromString(MAGIC_APE_STAKING_ADDRESS), 'getPoolsUI', 'getPoolsUI():((uint256,uint256,(uint48,uint48,uint96,uint96)),(uint256,uint256,(uint48,uint48,uint96,uint96)),(uint256,uint256,(uint48,uint48,uint96,uint96)),(uint256,uint256,(uint48,uint48,uint96,uint96)))')
    //             .withArgs([])
    //             .returns([
    //                 ethereum.Value.fromTuple([
    //                     ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0)),
    //                     ethereum.Value.fromUnsignedBigInt(BigInt.fromString('89288774957542205801038247')),
    //                     ethereum.Value.fromTuple([
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1694538000')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1702400400')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('2060439560439560439560')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))
    //                     ])
    //                 ]),
    //                 ethereum.Value.fromTuple([
    //                     ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1)),
    //                     ethereum.Value.fromUnsignedBigInt(BigInt.fromString('44722119004489146875929540')),
    //                     ethereum.Value.fromTuple([
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1694538000')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1702400400')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('3235233516483516483516')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('10094000000000000000000'))
    //                     ])
    //                 ]),
    //                 ethereum.Value.fromTuple([
    //                     ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(2)),
    //                     ethereum.Value.fromUnsignedBigInt(BigInt.fromString('17146675643485363082746886')),
    //                     ethereum.Value.fromTuple([
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1694538000')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1702400400')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1309065934065934065934')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('2042000000000000000000'))
    //                     ])
    //                 ]),
    //                 ethereum.Value.fromTuple([
    //                     ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(3)),
    //                     ethereum.Value.fromUnsignedBigInt(BigInt.fromString('3304528978557185780308161')),
    //                     ethereum.Value.fromTuple([
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1694538000')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('1702400400')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('263392857142857142857')),
    //                         ethereum.Value.fromUnsignedBigInt(BigInt.fromString('856000000000000000000'))
    //                     ])
    //                 ])
    //             ]);
    //     });

    //     test('update magic ape', () => {
    //         const log = createLogDeposit();

    //         handleLogDeposit(log);

    //         assert.entityCount(MAGIC_APE_ENTITY, 1);
    //         assert.fieldEquals(MAGIC_APE_ENTITY, MAGIC_APE_ADDRESS, 'apr', '1');
    //         assert.fieldEquals(MAGIC_APE_ENTITY, MAGIC_APE_ADDRESS, 'apy', '1');
    //     });
    // });
});
