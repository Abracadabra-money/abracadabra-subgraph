import { newMockEvent } from 'matchstick-as';
import { Deposit } from '../../../generated/MagicApeStaking/MagicApeStaking';
import { BIGINT_ZERO, ZERO_ADDRESS } from 'misc';
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { MAGIC_APE_ADDRESS } from '../../../src/constants';

export function createLogDeposit(): Deposit {
    const logDeposit: Deposit = changetype<Deposit>(newMockEvent());

    logDeposit.block.number = BIGINT_ZERO;
    logDeposit.block.timestamp = BigInt.fromI32(1696339936);
    logDeposit.address = Address.fromString(ZERO_ADDRESS);

    logDeposit.parameters = new Array();
    logDeposit.parameters.push(new ethereum.EventParam('user', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    logDeposit.parameters.push(new ethereum.EventParam('amount', ethereum.Value.fromI32(0)));
    logDeposit.parameters.push(new ethereum.EventParam('recipient', ethereum.Value.fromAddress(Address.fromString(MAGIC_APE_ADDRESS))));

    return logDeposit;
}
