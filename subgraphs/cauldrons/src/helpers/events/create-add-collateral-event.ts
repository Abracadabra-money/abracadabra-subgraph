import { AddCollateralEvent } from '../../../generated/schema';
import { LogAddCollateral } from '../../../generated/templates/Cauldron/Cauldron';
import { fillEvent } from './fill-event';
import { getAmount } from './get-amount';
import { getUsdAmount } from './get-usd-amount';

export function createAddCollateralEvent(contractEvent: LogAddCollateral): AddCollateralEvent {
    const addCollateralEvent = new AddCollateralEvent(`${contractEvent.transaction.hash.toHexString()}-${contractEvent.logIndex}`);
    fillEvent(contractEvent, contractEvent.params.to, addCollateralEvent);
    addCollateralEvent.from = contractEvent.params.from;
    addCollateralEvent.share = contractEvent.params.share;

    const amount = getAmount(contractEvent.address, contractEvent.params.share, false);
    addCollateralEvent.amount = amount;
    addCollateralEvent.amountUsd = getUsdAmount(contractEvent.address, amount);

    addCollateralEvent.save();
    return addCollateralEvent;
}
