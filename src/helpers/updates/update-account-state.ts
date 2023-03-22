import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/schema';
import { EventType } from '../../constants';
import { bigIntToBigDecimal, getLiquidationPrice } from '../../utils';
import { getOrCreateAccount, getOrCreateAccountState, getOrCreateAccountStateSnapshot } from '../account';
import { getOrCreateCollateral } from '../get-or-create-collateral';

export function updateAccountState(cauldron: Cauldron, accountId: string, eventType: string, amount: BigInt, block: ethereum.Block, transaction: ethereum.Transaction): void {
    const collateral = getOrCreateCollateral(Address.fromString(cauldron.collateral));
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

    if (eventType == EventType.REPAY) {
        accountState.borrowPart = accountState.borrowPart.minus(amount);
    }

    accountState.save();

    const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, block, transaction);
    snapshot.liquidationPrice = getLiquidationPrice(cauldron, collateral, accountState);

    if (eventType == EventType.WITHDRAW) {
        snapshot.withdrawidAmount = amount;
        snapshot.withdrawidAmountUsd = bigIntToBigDecimal(amount, collateral.decimals).times(collateral.lastPriceUsd);
    }

    if (eventType == EventType.REPAY) {
        snapshot.repaid = amount;
        snapshot.repaidUsd = bigIntToBigDecimal(amount);
    }

    snapshot.save();
}
