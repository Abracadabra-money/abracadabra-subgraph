import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly';
import { LogAddCollateral } from '../../generated/templates/Cauldron/Cauldron';
import { BLOCK_NUMBER, BLOCK_TIMESTAMP, CLONE_ADDRESS, MOCK_ACCOUNT } from '../constants';

export function createLogAddCollateral(): LogAddCollateral {
    const log: LogAddCollateral = changetype<LogAddCollateral>(newMockEvent());

    log.block.number = BLOCK_NUMBER;
    log.block.timestamp = BLOCK_TIMESTAMP;
    log.address = CLONE_ADDRESS;

    log.parameters = new Array();
    log.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(MOCK_ACCOUNT)));
    log.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(MOCK_ACCOUNT)));
    log.parameters.push(new ethereum.EventParam('share', ethereum.Value.fromUnsignedBigInt(BigInt.fromString("30658468234870000000000"))));

    return log;
}
