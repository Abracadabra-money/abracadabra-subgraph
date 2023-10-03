import { assert, describe, test } from 'matchstick-as/assembly';
import { createLogAccrueEvent } from './helpers/create-log-transfer';
import { ZERO_ADDRESS, bigIntToBigDecimal } from 'misc';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { MAGIC_GLP_ADDRESS } from '../src/constants';
import { handleLogTransfer } from '../src/mappings/magic-glp';
import { MAGIC_GLP_ENTITY } from './constants';

describe('Magic GLP', () => {
    test('handleLogTransfer', () => {
        const reward = 1000;

        const logTransfer = createLogAccrueEvent(Address.fromString(ZERO_ADDRESS), Address.fromString(MAGIC_GLP_ADDRESS), reward);

        handleLogTransfer(logTransfer);

        assert.entityCount(MAGIC_GLP_ENTITY, 1);
        assert.fieldEquals(MAGIC_GLP_ENTITY, MAGIC_GLP_ADDRESS, 'totalRewards', bigIntToBigDecimal(BigInt.fromI32(reward)).toString());
    });
});
