import { LogAccrue, LogBorrow, LogAddCollateral, LogRemoveCollateral, LogRepay, LogExchangeRate } from '../../generated/templates/Cauldron/Cauldron';
import { getCauldron } from '../helpers/cauldron';
import { getOrCreateCollateral } from '../helpers/collateral';
import { Address } from '@graphprotocol/graph-ts';
import { updateAccountState, updateLiquidationCount, updateTokenPrice } from '../helpers/updates';
import { updateTvl, updateLastActive, updateFeesGenerated } from '../helpers/updates';
import { bigIntToBigDecimal, BIGINT_ZERO } from 'misc';
import { getOrCreateAccount } from '../helpers/account';
import { BORROW_OPENING_FEE_PRECISION, LIQUIDATION_MULTIPLIER_PRECISION, DISTRIBUTION_PART, DISTRIBUTION_PRECISION, FeeType } from '../constants';
import { isLiquidate } from '../utils/is-liquidate';

export function handleLogAddCollateral(event: LogAddCollateral): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateAccountState(cauldron, event.params.to.toHexString(), event.params.share, BIGINT_ZERO, BIGINT_ZERO, BIGINT_ZERO, event.block, event.transaction);
    updateTvl(event.block);
}

export function handleLogRemoveCollateral(event: LogRemoveCollateral): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateAccountState(
        cauldron,
        event.params.from.toHexString(),
        event.params.share.neg(),
        BIGINT_ZERO,
        BIGINT_ZERO,
        BIGINT_ZERO,
        event.block,
        event.transaction,
        isLiquidate(event),
    );
    updateTvl(event.block);
}

export function handleLogBorrow(event: LogBorrow): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;

    const borrowAmountWithFee = event.params.amount;
    const borrowAmount = borrowAmountWithFee.times(BORROW_OPENING_FEE_PRECISION).div(cauldron.borrowOpeningFee.plus(BORROW_OPENING_FEE_PRECISION));
    const feeAmount = borrowAmountWithFee.minus(borrowAmount);

    updateLastActive(cauldron, event.block);
    updateAccountState(cauldron, event.params.from.toHexString(), BIGINT_ZERO, event.params.part, event.params.amount, feeAmount, event.block, event.transaction);
    updateFeesGenerated(cauldron, bigIntToBigDecimal(feeAmount), event.block, FeeType.BORROW);
}

export function handleLogRepay(event: LogRepay): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    const account = getOrCreateAccount(cauldron, event.params.to.toHexString(), event.block);
    const isLiquidationTx = isLiquidate(event);

    updateLastActive(cauldron, event.block);
    updateAccountState(cauldron, account.id, BIGINT_ZERO, event.params.part.neg(), event.params.amount.neg(), BIGINT_ZERO, event.block, event.transaction, isLiquidationTx);
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
