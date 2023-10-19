import { Deposit, Withdraw } from '../../generated/MagicApe/MagicApe';
import { updateMagicApeTvl, updateMagicApePrice } from '../helpers/updates';

export function handleLogDeposit(event: Deposit): void {
    updateMagicApeTvl(event.block);
    updateMagicApePrice(event.block);
}

export function handleLogWithdraw(event: Withdraw): void {
    updateMagicApeTvl(event.block);
    updateMagicApePrice(event.block);
}
