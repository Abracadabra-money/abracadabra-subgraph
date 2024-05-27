import { Deposit, Withdraw, Transfer } from '../../generated/Stake/Stake';
import { getLpBalance, getOrCreateAccount, getStakeBalance } from '../helpers';

export function handleDeposit(event: Deposit): void {
    const account = getOrCreateAccount(event.params.provider);
    account.stakedBalance = getStakeBalance(event.params.provider);
    account.lpBalance = getLpBalance(event.params.provider);
    account.save();
}

export function handleWithdraw(event: Withdraw): void {
    const account = getOrCreateAccount(event.params.provider);
    account.stakedBalance = getStakeBalance(event.params.provider);
    account.lpBalance = getLpBalance(event.params.provider);
    account.save();
}

export function handleTransfer(event: Transfer): void {
    const addresses = [event.params._from, event.params._to];
    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];
        const account = getOrCreateAccount(address);
        account.stakedBalance = getStakeBalance(address);
        account.save();
    }
}