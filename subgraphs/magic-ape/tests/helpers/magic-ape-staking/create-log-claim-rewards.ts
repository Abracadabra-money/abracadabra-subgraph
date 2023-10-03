import { newMockEvent } from 'matchstick-as';
import { ClaimRewards } from '../../../generated/MagicApeStaking/MagicApeStaking';
import { BIGINT_ZERO, ZERO_ADDRESS } from 'misc';
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { MAGIC_APE_ADDRESS } from '../../../src/constants';

export function createLogClaimRewards(amount: BigInt): ClaimRewards {
    const log: ClaimRewards = changetype<ClaimRewards>(newMockEvent());

    log.block.number = BIGINT_ZERO;
    log.block.timestamp = BigInt.fromI32(1696339936);
    log.address = Address.fromString(ZERO_ADDRESS);

    log.parameters = new Array();
    log.parameters.push(new ethereum.EventParam('user', ethereum.Value.fromAddress(Address.fromString(ZERO_ADDRESS))));
    log.parameters.push(new ethereum.EventParam('amount', ethereum.Value.fromUnsignedBigInt(amount)));
    log.parameters.push(new ethereum.EventParam('recipient', ethereum.Value.fromAddress(Address.fromString(MAGIC_APE_ADDRESS))));

    return log;
}
