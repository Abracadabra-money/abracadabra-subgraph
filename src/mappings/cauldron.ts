import { LogAccrue, LogBorrow, LogAddCollateral, LogRemoveCollateral, LogRepay, LogExchangeRate, BorrowCall, CookCall } from '../../generated/templates/Cauldron/Cauldron';
import { getCauldron } from '../helpers/cauldron';
import { getOrCreateCollateral } from '../helpers/get-or-create-collateral';
import { Address, ethereum, log } from '@graphprotocol/graph-ts';
import { updateTokenPrice } from '../helpers/updates';
import { updateTvl, updateLastActive, updateFeesGenerated } from '../helpers/updates';
import { updateTokensPrice } from '../helpers/updates/update-tokens-price';
import { bigIntToBigDecimal } from '../utils';
import { BORROW_OPENING_FEE_PRECISION, ACTION_BORROW } from '../constants';

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

export function handleBorrowCall(call: BorrowCall): void {
    const cauldron = getCauldron(call.to.toHexString());
    if (!cauldron) return;

    const feeAmount = call.inputs.amount.times(cauldron.borrowOpeningFee).div(BORROW_OPENING_FEE_PRECISION);
    updateFeesGenerated(cauldron, bigIntToBigDecimal(feeAmount), call.block);
}

export function handleCookCall(call: CookCall): void {
    const cauldron = getCauldron(call.to.toHexString());
    if (!cauldron) return;

    for (let i = 0; i < call.inputs.actions.length; i++) {
        const action = call.inputs.actions[i];
        if (action == ACTION_BORROW) {
            const decode = ethereum.decode('(int256,address)', call.inputs.datas[i])!.toTuple();
            const amount = decode[0].toBigInt();
            const feeAmount = amount.times(cauldron.borrowOpeningFee).div(BORROW_OPENING_FEE_PRECISION);
            updateFeesGenerated(cauldron, bigIntToBigDecimal(feeAmount), call.block);
        }
    }
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
    updateFeesGenerated(cauldron, bigIntToBigDecimal(event.params.accruedAmount), event.block);
}
