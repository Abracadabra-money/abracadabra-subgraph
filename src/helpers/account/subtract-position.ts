import { BigInt, ethereum, log } from '@graphprotocol/graph-ts';
import { Account, Cauldron, Position, PositionCounter } from '../../../generated/schema';
import { BIGINT_ZERO, EventType } from '../../constants';
import { snapshotPosition } from './snapshot-position';

export function subtractPosition(cauldron: Cauldron, account: Account, newBalance: BigInt, eventType: string, side: string, event: ethereum.Event): Position | null {
    const counterID = account.id.concat('-').concat(cauldron.id).concat('-').concat(side);
    const positionCounter = PositionCounter.load(counterID);
    if (!positionCounter) {
        log.warning('[subtractPosition] position counter {} not found', [counterID]);
        return null;
    }
    const positionID = positionCounter.id.concat('-').concat(positionCounter.nextCount.toString());
    const position = Position.load(positionID);
    if (!position) {
        log.warning('[subtractPosition] position {} not found', [positionID]);
        return null;
    }
    position.balance = newBalance;
    if (eventType == EventType.WITHDRAW) {
        position.withdrawCount += 1;
    } else if (eventType == EventType.REPAY) {
        position.repayCount += 1;
    }
    position.save();

    const closePosition = position.balance == BIGINT_ZERO;

    if (closePosition) {
        //
        // update position counter
        //
        positionCounter.nextCount += 1;
        positionCounter.save();

        //
        // close position
        //
        position.hashClosed = event.transaction.hash.toHexString();
        position.blockNumberClosed = event.block.number;
        position.timestampClosed = event.block.timestamp;
        position.save();
    }

    //
    // update position snapshot
    //
    snapshotPosition(position, event);

    return position;
}
