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

    const snapshot = getOrCreateAccountStateSnapshot(cauldron, account, accountState, block, transaction);
    snapshot.liquidationPrice = getLiquidationPrice(cauldron, collateral, accountState);
    snapshot.borrowPart = accountState.borrowPart;
    snapshot.collateralShare = accountState.collateralShare;
    snapshot.collateralPriceUsd = cauldron.collateralPriceUsd;

    if (eventType == EventType.WITHDRAW) {
        snapshot.withdrawidAmount = snapshot.withdrawidAmount.plus(amount);
        snapshot.withdrawidAmountUsd = snapshot.withdrawidAmountUsd.plus(bigIntToBigDecimal(amount, collateral.decimals).times(collateral.lastPriceUsd));
    }

    if (eventType == EventType.REPAY) {
        snapshot.repaid = snapshot.repaid.plus(amount);
        snapshot.repaidUsd = snapshot.repaidUsd.plus(bigIntToBigDecimal(amount));
    }

    snapshot.save();

    accountState.lastAction = snapshot.id;
    accountState.save();
}
