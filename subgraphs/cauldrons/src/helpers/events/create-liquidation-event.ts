import { LiquidationEvent, RemoveCollateralEvent } from '../../../generated/schema';
import { LogRepay } from '../../../generated/templates/Cauldron/Cauldron';
import { fillEvent } from './fill-event';

export function createLiquidationEvent(contractEvent: LogRepay, removeCollateralEvent: RemoveCollateralEvent): LiquidationEvent {
    const liquidationEvent = new LiquidationEvent(`${contractEvent.transaction.hash.toHexString()}-${contractEvent.logIndex}`);
    fillEvent(contractEvent, contractEvent.params.to, liquidationEvent);
    liquidationEvent.liquidator = contractEvent.params.from;
    liquidationEvent.to = removeCollateralEvent.to;
    liquidationEvent.liquidateShare = removeCollateralEvent.share;
    liquidationEvent.liquidateAmount = removeCollateralEvent.amount;
    liquidationEvent.liquidateAmountUsd = removeCollateralEvent.amountUsd;

    liquidationEvent.repayAmount = contractEvent.params.amount;
    liquidationEvent.repayPart = contractEvent.params.part;

    liquidationEvent.save();
    return liquidationEvent;
}
