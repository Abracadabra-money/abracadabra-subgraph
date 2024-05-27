import { Transfer, AddLiquidity, RemoveLiquidity, RemoveLiquidityImbalance, RemoveLiquidityOne } from '../../generated/Pool/Pool';
import { getLpBalance, getOrCreateAccount } from '../helpers';

export function handleTransfer(event: Transfer): void{
    const addresses = [event.params.receiver, event.params.sender];
    for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];
        const account = getOrCreateAccount(address);
        account.lpBalance = getLpBalance(address);
        account.save();
    }
}

export function handleAddLiquidity(event: AddLiquidity): void{
    const account = getOrCreateAccount(event.params.provider);
    account.lpBalance = getLpBalance(event.params.provider);
    account.save();
}

export function handleRemoveLiquidity(event: RemoveLiquidity): void{
    const account = getOrCreateAccount(event.params.provider);
    account.lpBalance = getLpBalance(event.params.provider);
    account.save();
}

export function handleRemoveLiquidityOne(event: RemoveLiquidityImbalance): void{
    const account = getOrCreateAccount(event.params.provider);
    account.lpBalance = getLpBalance(event.params.provider);
    account.save();
}

export function handleRemoveLiquidityImbalance(event: RemoveLiquidityOne): void{
    const account = getOrCreateAccount(event.params.provider);
    account.lpBalance = getLpBalance(event.params.provider);
    account.save();
}