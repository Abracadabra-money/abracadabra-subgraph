import { newMockEvent } from 'matchstick-as';
import { ethereum, Address, Bytes } from '@graphprotocol/graph-ts';
import { LogDeploy } from '../../generated/BentoBox/BentoBox';
import { ABRA_DEPLOYERS } from '../../src/constants';
import { BLOCK_NUMBER, BLOCK_TIMESTAMP } from './constants';

export function createLogDeployEvent(masterContract: Address, data: Bytes, cloneAddress: Address): LogDeploy {
    const logDeployEvent: LogDeploy = changetype<LogDeploy>(newMockEvent());

    logDeployEvent.transaction.from = Address.fromString(ABRA_DEPLOYERS[0]);
    logDeployEvent.block.number = BLOCK_NUMBER;
    logDeployEvent.block.timestamp = BLOCK_TIMESTAMP;

    logDeployEvent.parameters = new Array();

    logDeployEvent.parameters.push(new ethereum.EventParam('masterContract', ethereum.Value.fromAddress(masterContract)));
    logDeployEvent.parameters.push(new ethereum.EventParam('data', ethereum.Value.fromBytes(data)));
    logDeployEvent.parameters.push(new ethereum.EventParam('cloneAddress', ethereum.Value.fromAddress(cloneAddress)));

    return logDeployEvent;
}
