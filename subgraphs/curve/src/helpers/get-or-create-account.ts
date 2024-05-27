import { Address } from '@graphprotocol/graph-ts';
import { Account } from '../../generated/schema';
import { BIGINT_ZERO } from 'misc';

export function getOrCreateAccount(address: Address): Account {
    let account = Account.load(address.toHexString());
    if (account === null) {
        account = new Account(address.toHexString());
        account.stakedBalance = BIGINT_ZERO;
        account.lpBalance = BIGINT_ZERO;
        account.save();
    }
    return account as Account;
}
