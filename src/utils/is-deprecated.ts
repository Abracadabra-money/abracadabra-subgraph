import { ethereum } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../generated/schema';
import { SECONDS_PER_DAY } from '../constants';

export function isDeprecated(cauldron: Cauldron, block: ethereum.Block): boolean {
    if (cauldron.deprecated) return false;

    const lastActive = cauldron.lastActive.toI64() / SECONDS_PER_DAY;
    const currentTimestamp = block.timestamp.toI64() / SECONDS_PER_DAY;

    if (currentTimestamp > lastActive + 90) return true;
    return false;
}
