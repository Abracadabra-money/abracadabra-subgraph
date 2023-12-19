import { BorrowEvent } from '../../../generated/schema';
import { LogBorrow } from '../../../generated/templates/Cauldron/Cauldron';
import { fillEvent } from './fill-event';

export function createBorrowEvent(contractEvent: LogBorrow): BorrowEvent {
    const borrowEvent = new BorrowEvent(`${contractEvent.transaction.hash.toHexString()}-${contractEvent.logIndex}`);
    fillEvent(contractEvent, contractEvent.params.from, borrowEvent);
    borrowEvent.to = contractEvent.params.to;
    borrowEvent.amount = contractEvent.params.amount;
    borrowEvent.part = contractEvent.params.part;
    borrowEvent.save();
    return borrowEvent;
}
