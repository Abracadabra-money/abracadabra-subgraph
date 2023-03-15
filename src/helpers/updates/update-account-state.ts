import { BigInt, ethereum } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/schema';
import { EventType } from '../../constants';
import { getOrCreateAccount, getOrCreateAccountState } from '../account';

export function updateAccountState(cauldron: Cauldron, accountId: string, eventType: string, amount: BigInt, block: ethereum.Block): void {
    const account = getOrCreateAccount(cauldron, accountId, block);
    const accountState = getOrCreateAccountState(cauldron, account);

    if (eventType == EventType.DEPOSIT) {
        accountState.collateralShare = accountState.collateralShare.plus(amount);
    }

    if (eventType == EventType.WITHDRAW) {
        accountState.collateralShare = accountState.collateralShare.minus(amount);
    }

    if (eventType == EventType.BORROW) {
        accountState.borrowPart = accountState.borrowPart.plus(amount);
    }

    if (eventType == EventType.BORROW) {
        accountState.borrowPart = accountState.borrowPart.minus(amount);
    }

    accountState.save();
}
