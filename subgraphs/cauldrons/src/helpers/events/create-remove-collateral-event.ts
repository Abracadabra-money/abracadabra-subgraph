import { RemoveCollateralEvent } from '../../../generated/schema';
import { LogRemoveCollateral } from '../../../generated/templates/Cauldron/Cauldron';
import { fillEvent } from './fill-event';
import { getAmount } from './get-amount';
import { getUsdAmount } from './get-usd-amount';

export function createRemoveCollateralEvent(contractEvent: LogRemoveCollateral): RemoveCollateralEvent {
    const removeCollateralEvent = new RemoveCollateralEvent(`${contractEvent.transaction.hash.toHexString()}-${contractEvent.logIndex}`);
    fillEvent(contractEvent, contractEvent.params.from, removeCollateralEvent);
    removeCollateralEvent.to = contractEvent.params.to;
    removeCollateralEvent.share = contractEvent.params.share;

    const amount = getAmount(contractEvent.address, contractEvent.params.share, false);
    removeCollateralEvent.amount = amount;
    removeCollateralEvent.amountUsd = getUsdAmount(contractEvent.address, amount);

    removeCollateralEvent.save();
    return removeCollateralEvent;
}
