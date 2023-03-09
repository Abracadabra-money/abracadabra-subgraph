import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/DegenBox/Cauldron';
import { BIGINT_ZERO, PositionSide } from '../../constants';

export function getAccountBalance(cauldronAddress: Address, accountAddress: Address, positionSide: string): BigInt {
    const cauldronContract = Cauldron.bind(cauldronAddress);

    let tryBalance: ethereum.CallResult<BigInt>;
    if (positionSide == PositionSide.BORROWER) {
        tryBalance = cauldronContract.try_userBorrowPart(accountAddress);
    } else {
        tryBalance = cauldronContract.try_userCollateralShare(accountAddress);
    }

    return tryBalance.reverted ? BIGINT_ZERO : tryBalance.value;
}
