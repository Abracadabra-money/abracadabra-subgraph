import { Address, ethereum } from '@graphprotocol/graph-ts';
import { Deposit } from '../../generated/MSpell/MSpell';
import { newMockEvent } from 'matchstick-as/assembly';
import { BIGINT_ZERO, ZERO_ADDRESS } from 'misc';

export function createLogDeposit(): Deposit {
    const log: Deposit = changetype<Deposit>(newMockEvent());

    log.block.number = BIGINT_ZERO;
    log.block.timestamp = BIGINT_ZERO;
    log.address = Address.fromString(ZERO_ADDRESS);

    log.parameters = new Array();
    log.parameters.push(new ethereum.EventParam('user', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    log.parameters.push(new ethereum.EventParam('amount', ethereum.Value.fromI32(10)));

    return log;
}
