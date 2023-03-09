import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { Account, Cauldron, Position, PositionCounter } from '../../../generated/schema';
import { EventType } from '../../constants';
import { snapshotPosition } from './snapshot-position';

export function addPosition(cauldron: Cauldron, account: Account, newBalance: BigInt, eventType: string, side: string, event: ethereum.Event): Position {
    const counterID = account.id.concat('-').concat(cauldron.id).concat('-').concat(side);
    let positionCounter = PositionCounter.load(counterID);
    if (!positionCounter) {
        positionCounter = new PositionCounter(counterID);
        positionCounter.nextCount = 0;
        positionCounter.save();
    }

    const positionId = positionCounter.id.concat('-').concat(positionCounter.nextCount.toString());
    let position = Position.load(positionId);

    if (position) {
        position.balance = newBalance;
        if (eventType == EventType.DEPOSIT) {
            position.depositCount += 1;
        } else if (eventType == EventType.BORROW) {
            position.borrowCount += 1;
        }
        position.save();

        snapshotPosition(position, event);
        return position;
    }

    // open a new position
    position = new Position(positionId);
    position.account = account.id;
    position.cauldron = cauldron.id;
    position.hashOpened = event.transaction.hash.toHexString();
    position.blockNumberOpened = event.block.number;
    position.timestampOpened = event.block.timestamp;
    position.side = side;
    position.balance = newBalance;
    position.depositCount = 0;
    position.withdrawCount = 0;
    position.borrowCount = 0;
    position.repayCount = 0;
    position.liquidationCount = 0;
    if (eventType == EventType.DEPOSIT) {
        position.depositCount += 1;
    } else if (eventType == EventType.BORROW) {
        position.borrowCount += 1;
    }
    position.save();

    snapshotPosition(position, event);
    return position;
}
