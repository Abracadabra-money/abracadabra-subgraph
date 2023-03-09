import { LogAccrue, LogBorrow, LogAddCollateral, LogRemoveCollateral, LogRepay, LogExchangeRate, Cauldron } from '../../generated/templates/Cauldron/Cauldron';
import { DegenBox } from '../../generated/DegenBox/DegenBox';
import { getCauldron, getFeesEarned } from '../helpers/cauldron';
import { getOrCreateCollateral } from '../helpers/get-or-create-collateral';
import { Address } from '@graphprotocol/graph-ts';
import { updateTokenPrice } from '../helpers/updates';
import { updateTvl, updateLastActive, updateFeesGenerated } from '../helpers/updates';
import { updateTokensPrice } from '../helpers/updates/update-tokens-price';
import { bigIntToBigDecimal } from '../utils';
import { Deposit } from '../../generated/schema';
import { updatePosition } from '../helpers/account/update-position';
import { EventType, PositionSide } from '../constants';

export function handleLogAddCollateral(event: LogAddCollateral): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateTokensPrice(event.block);

    const deposit = new Deposit(`${event.transaction.hash.toHexString}-${event.transactionLogIndex.toString()}`);
    const CauldronContract = Cauldron.bind(event.address);
    const collateralToken = getOrCreateCollateral(Address.fromString(cauldron.collateral));

    const tokenPriceUSD = collateralToken.lastPriceUsd;
    deposit.hash = event.transaction.hash.toHexString();
    deposit.nonce = event.transaction.nonce;
    deposit.logIndex = event.transactionLogIndex.toI32();
    deposit.cauldron = cauldron.id;
    deposit.account = event.params.to.toHexString();
    deposit.blockNumber = event.block.number;
    deposit.timestamp = event.block.timestamp;
    deposit.collateral = collateralToken.id;
    deposit.amount = DegenBox.bind(CauldronContract.bentoBox()).toAmount(Address.fromString(collateralToken.id), event.params.share, false);
    deposit.amountUsd = bigIntToBigDecimal(event.params.share, collateralToken.decimals).times(tokenPriceUSD!);
    deposit.position = updatePosition(PositionSide.LENDER, cauldron, EventType.DEPOSIT, deposit.account, event);
    deposit.save();

    updateTvl(event.block);
}

export function handleLogRemoveCollateral(event: LogRemoveCollateral): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateTokensPrice(event.block);

    updateTvl(event.block);
}

export function handleLogBorrow(event: LogBorrow): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateTokensPrice(event.block);
}

export function handleLogRepay(event: LogRepay): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateTokensPrice(event.block);

    updateTvl(event.block);
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

    const feesEarned = getFeesEarned(event.address);
    const fees = feesEarned.ge(cauldron.feesEarned) ? feesEarned.minus(cauldron.feesEarned) : feesEarned;
    updateFeesGenerated(cauldron, bigIntToBigDecimal(fees), event.block);

    cauldron.feesEarned = feesEarned;
    cauldron.save();
}
