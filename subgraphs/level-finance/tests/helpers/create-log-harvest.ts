import { LogHarvest } from '../../generated/LevelFinance/MagicLevelHarvestor';
import { newMockEvent } from 'matchstick-as/assembly';
import { BIGINT_ZERO } from 'misc';
import { BigInt, Address, ethereum } from '@graphprotocol/graph-ts';

export function createLogHarvest(vault: string, amount: BigInt): LogHarvest {
    const logDeposit: LogHarvest = changetype<LogHarvest>(newMockEvent());

    logDeposit.block.number = BIGINT_ZERO;
    logDeposit.block.timestamp = BigInt.fromI32(1696339936);

    logDeposit.parameters = new Array();
    logDeposit.parameters.push(new ethereum.EventParam('vault', ethereum.Value.fromAddress(Address.fromString(vault))));
    logDeposit.parameters.push(new ethereum.EventParam('total', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))));
    logDeposit.parameters.push(new ethereum.EventParam('amount', ethereum.Value.fromUnsignedBigInt(amount)));
    logDeposit.parameters.push(new ethereum.EventParam('fee', ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))));

    return logDeposit;
}
