import { Address, ethereum, BigInt } from '@graphprotocol/graph-ts';
import { Withdraw } from '../../../generated/MagicApe/MagicApe';
import { newMockEvent } from 'matchstick-as/assembly';
import { BIGINT_ZERO, ZERO_ADDRESS } from 'misc';

export function createLogWithdraw(): Withdraw {
    const logWithdraw: Withdraw = changetype<Withdraw>(newMockEvent());

    logWithdraw.block.number = BIGINT_ZERO;
    logWithdraw.block.timestamp = BigInt.fromI32(1696339936);
    logWithdraw.address = Address.fromString(ZERO_ADDRESS);

    logWithdraw.parameters = new Array();
    logWithdraw.parameters.push(new ethereum.EventParam('caller', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    logWithdraw.parameters.push(new ethereum.EventParam('receiver', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    logWithdraw.parameters.push(new ethereum.EventParam('owner', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    logWithdraw.parameters.push(new ethereum.EventParam('assets', ethereum.Value.fromI32(0)));
    logWithdraw.parameters.push(new ethereum.EventParam('shares', ethereum.Value.fromI32(0)));

    return logWithdraw;
}
