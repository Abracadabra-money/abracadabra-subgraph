import { BigDecimal } from '@graphprotocol/graph-ts';
import { AccountState, Cauldron } from '../../generated/schema';
import { COLLATERIZATION_RATE_PRECISION } from '../constants';
import { bigIntToBigDecimal } from './big-int-to-big-decimal';

export function getLiquidationPrice(cauldron: Cauldron, accountState: AccountState): BigDecimal {
    const borrow = bigIntToBigDecimal(accountState.borrowPart);
    const collateral = bigIntToBigDecimal(accountState.collateralShare);
    const liquidationMultiplier = cauldron.collaterizationRate.div(COLLATERIZATION_RATE_PRECISION).toBigDecimal();
    return borrow.div(collateral).div(liquidationMultiplier);
}
