import { LogAccrue, LogBorrow, LogAddCollateral, LogRemoveCollateral, LogRepay, LogExchangeRate } from '../../generated/templates/Cauldron/Cauldron';
import { getCauldron, getFeesEarned } from '../helpers/cauldron';
import { getOrCreateCollateral } from '../helpers/get-or-create-collateral';
import { Address } from '@graphprotocol/graph-ts';
import { updateTokenPrice } from '../helpers/updates';
import { updateTvl, updateLastActive, updateFeesGenerated } from '../helpers/updates';
import { updateTokensPrice } from '../helpers/updates/update-tokens-price';
import { bigIntToBigDecimal } from '../utils';

export function handleLogAddCollateral(event: LogAddCollateral): void {
    const cauldron = getCauldron(event.address.toHexString());
    if (!cauldron) return;
    updateLastActive(cauldron, event.block);
    updateTokensPrice(event.block);

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
