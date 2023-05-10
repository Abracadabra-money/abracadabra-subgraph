import { ethereum } from '@graphprotocol/graph-ts';
import { Account, AccountStateSnapshot, Cauldron, AccountState } from '../../../generated/schema';
import { BIGINT_ZERO, BIGDECIMAL_ZERO } from '../../constants';

export function getOrCreateAccountStateSnapshot(
    cauldron: Cauldron,
    account: Account,
    state: AccountState,
    block: ethereum.Block,
    transaction: ethereum.Transaction,
): AccountStateSnapshot {
    const id = `${cauldron.id}-${account.id}-${transaction.hash.toHexString()}`;
    let snapshot = AccountStateSnapshot.load(id);
    if (!snapshot) {
        snapshot = new AccountStateSnapshot(id);
        snapshot.account = account.id;
        snapshot.cauldron = cauldron.id;
        snapshot.state = state.id;
        snapshot.borrowPart = BIGINT_ZERO;
        snapshot.collateralShare = BIGINT_ZERO;
        snapshot.collateralPriceUsd = cauldron.collateralPriceUsd;
        snapshot.liquidationPrice = BIGDECIMAL_ZERO;
        snapshot.withdrawAmount = BIGINT_ZERO;
        snapshot.withdrawAmountUsd = BIGDECIMAL_ZERO;
        snapshot.repaid = BIGINT_ZERO;
        snapshot.repaidUsd = BIGDECIMAL_ZERO;
        snapshot.isLiquidated = false;
        snapshot.hash = transaction.hash.toHexString();
        snapshot.blockNumber = block.number;
        snapshot.timestamp = block.timestamp;
        snapshot.save();
    }
    return snapshot;
}
