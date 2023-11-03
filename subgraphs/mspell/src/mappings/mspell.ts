import { Deposit, Withdraw } from '../../generated/MSpell/MSpell';
import { updateTvl } from '../helpers/update-tvl';

export function handleLogDeposit(event: Deposit): void {
    updateTvl(event.block);
}

export function handleLogWithdraw(event: Withdraw): void {
    updateTvl(event.block);
}
