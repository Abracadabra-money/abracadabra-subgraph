import { Address, ethereum, BigInt } from '@graphprotocol/graph-ts';
import { Deposit } from '../../../generated/MagicApe/MagicApe';
import { newMockEvent } from 'matchstick-as/assembly';
import { BIGINT_ZERO, ZERO_ADDRESS } from 'misc';

export function createLogDeposit(): Deposit {
    const logDeposit: Deposit = changetype<Deposit>(newMockEvent());

    logDeposit.block.number = BIGINT_ZERO;
    logDeposit.block.timestamp = BigInt.fromI32(1696339936);
    logDeposit.address = Address.fromString(ZERO_ADDRESS);

    logDeposit.parameters = new Array();
    logDeposit.parameters.push(new ethereum.EventParam('caller', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    logDeposit.parameters.push(new ethereum.EventParam('owner', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    logDeposit.parameters.push(new ethereum.EventParam('assets', ethereum.Value.fromI32(0)));
    logDeposit.parameters.push(new ethereum.EventParam('shares', ethereum.Value.fromI32(0)));

    return logDeposit;
}
