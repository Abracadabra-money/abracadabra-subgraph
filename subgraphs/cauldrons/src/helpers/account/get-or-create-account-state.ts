import { Account, AccountState, Cauldron } from '../../../generated/schema';
import { BIGINT_ZERO } from 'misc';

export function getOrCreateAccountState(cauldron: Cauldron, account: Account): AccountState {
    const id = `${cauldron.id}-${account.id}`;
    let state = AccountState.load(id);
    if (!state) {
        state = new AccountState(id);
        state.cumulativeBorrowAmount = BIGINT_ZERO;
        state.cumulativeRepayAmount = BIGINT_ZERO;
        state.borrowFeesPaid = BIGINT_ZERO;
        state.borrowPart = BIGINT_ZERO;
        state.collateralShare = BIGINT_ZERO;
        state.account = account.id;
        state.cauldron = cauldron.id;
        state.save();
    }
    return state;
}
