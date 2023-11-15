import { RepayEvent } from '../../../generated/schema';
import { LogRepay } from '../../../generated/templates/Cauldron/Cauldron';
import { fillEvent } from './fill-event';

export function createRepayEvent(contractEvent: LogRepay): RepayEvent {
    const repayEvent = new RepayEvent(`${contractEvent.transaction.hash.toHexString()}-${contractEvent.logIndex}`);
    fillEvent(contractEvent, contractEvent.params.to, repayEvent);
    repayEvent.from = contractEvent.params.from;
    repayEvent.amount = contractEvent.params.amount;
    repayEvent.part = contractEvent.params.part;
    repayEvent.save();
    return repayEvent;
}
