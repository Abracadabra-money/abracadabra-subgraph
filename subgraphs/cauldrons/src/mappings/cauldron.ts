import { LogAccrue, LogBorrow, LogAddCollateral, LogRemoveCollateral, LogRepay, LogExchangeRate } from '../../generated/templates/Cauldron/Cauldron';
import { getCauldron } from '../helpers/cauldron';
import { getOrCreateCollateral } from '../helpers/collateral';
import { Address, store } from '@graphprotocol/graph-ts';
import { updateAccountState, updateLiquidationCount, updateTokenPrice } from '../helpers/updates';
import { updateTvl, updateLastActive, updateFeesGenerated } from '../helpers/updates';
import { bigIntToBigDecimal, BIGDECIMAL_ONE, BIGINT_ONE } from 'misc';
import { getOrCreateAccount } from '../helpers/account';
import { BORROW_OPENING_FEE_PRECISION, LIQUIDATION_MULTIPLIER_PRECISION, DISTRIBUTION_PART, DISTRIBUTION_PRECISION, EventType, FeeType } from '../constants';
import { isLiquidate } from '../utils/is-liquidate';
import { createAddCollateralEvent, createBorrowEvent, createLiquidationEvent, createRemoveCollateralEvent, createRepayEvent } from '../helpers/events';
import { RemoveCollateralEvent } from '../../generated/schema';

export function handleLogAddCollateral(event: LogAddCollateral): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateAccountState(cauldron, event.params.to.toHexString(), EventType.DEPOSIT, event.params.share, event.block, event.transaction);
    updateTvl(event.block);
    createAddCollateralEvent(event);
}

export function handleLogRemoveCollateral(event: LogRemoveCollateral): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateAccountState(cauldron, event.params.from.toHexString(), EventType.WITHDRAW, event.params.share, event.block, event.transaction, isLiquidate(event));
    updateTvl(event.block);
    createRemoveCollateralEvent(event);
}

export function handleLogBorrow(event: LogBorrow): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateAccountState(cauldron, event.params.from.toHexString(), EventType.BORROW, event.params.part, event.block, event.transaction);
    const borrowAmountWithFee = bigIntToBigDecimal(event.params.amount);
    const borrowAmount = borrowAmountWithFee.div(cauldron.borrowOpeningFee.divDecimal(BORROW_OPENING_FEE_PRECISION.toBigDecimal()).plus(BIGDECIMAL_ONE));
    const feeAmount = borrowAmountWithFee.minus(borrowAmount);
    updateFeesGenerated(cauldron, feeAmount, event.block, FeeType.BORROW);
    createBorrowEvent(event);
}

export function handleLogRepay(event: LogRepay): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    const account = getOrCreateAccount(cauldron, event.params.to.toHexString(), event.block);
    const isLiquidationTx = isLiquidate(event);

    updateLastActive(cauldron, event.block);
    updateAccountState(cauldron, account.id, EventType.REPAY, event.params.part, event.block, event.transaction, isLiquidationTx);
    updateTvl(event.block);

    if (isLiquidationTx) {
        updateLiquidationCount(cauldron, account, event.block);

        if (cauldron.liquidationMultiplier.isZero()) return;
        const distributionAmount = event.params.amount
            .times(cauldron.liquidationMultiplier)
            .div(LIQUIDATION_MULTIPLIER_PRECISION)
            .minus(event.params.amount)
            .times(DISTRIBUTION_PART)
            .div(DISTRIBUTION_PRECISION);

        updateFeesGenerated(cauldron, bigIntToBigDecimal(distributionAmount), event.block, FeeType.LIQUADATION);
    }

    const removeCollateralEvent = RemoveCollateralEvent.loadInBlock(`${event.transaction.hash.toHexString()}-${event.logIndex.minus(BIGINT_ONE)}`);
    if (removeCollateralEvent !== null) {
        // It is a liquidation
        createLiquidationEvent(event, removeCollateralEvent);
        store.remove('RemoveCollateralEvent', removeCollateralEvent.id);
    } else {
        createRepayEvent(event);
    }
}

export function handleLogExchangeRate(event: LogExchangeRate): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);

    const collateral = getOrCreateCollateral(Address.fromString(cauldron.collateral));

    cauldron.exchangeRate = event.params.rate;
    cauldron.save();

    updateTokenPrice(event.params.rate, collateral, cauldron, event.block);
    updateTvl(event.block);
}

export function handleLogAccrue(event: LogAccrue): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;

    updateLastActive(cauldron, event.block);
    updateFeesGenerated(cauldron, bigIntToBigDecimal(event.params.accruedAmount), event.block, FeeType.INTEREST);
}
