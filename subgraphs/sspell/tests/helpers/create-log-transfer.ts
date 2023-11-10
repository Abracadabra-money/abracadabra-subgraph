import { Address, ethereum } from '@graphprotocol/graph-ts';
import { Transfer } from '../../generated/SSpell/SSpell';
import { newMockEvent } from 'matchstick-as/assembly';
import { BIGINT_ZERO, ZERO_ADDRESS } from 'misc';

export function createLogTransfer(): Transfer {
    const logTransfer: Transfer = changetype<Transfer>(newMockEvent());

    logTransfer.block.number = BIGINT_ZERO;
    logTransfer.block.timestamp = BIGINT_ZERO;
    logTransfer.address = Address.fromString(ZERO_ADDRESS);

    logTransfer.parameters = new Array();
    logTransfer.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    logTransfer.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    logTransfer.parameters.push(new ethereum.EventParam('amount', ethereum.Value.fromI32(100000)));

    return logTransfer;
}
