import { BigDecimal } from '@graphprotocol/graph-ts';
import { AccountState, Cauldron, Collateral } from '../../generated/schema';
import { BIGDECIMAL_ZERO } from '../constants';
import { bigIntToBigDecimal } from './big-int-to-big-decimal';

export function getLiquidationPrice(cauldron: Cauldron, collateral: Collateral, accountState: AccountState): BigDecimal {
    if(accountState.borrowPart.isZero() || accountState.collateralShare.isZero()) return BIGDECIMAL_ZERO;
    const borrow = bigIntToBigDecimal(accountState.borrowPart);
    const collateralShare = bigIntToBigDecimal(accountState.collateralShare, collateral.decimals);
    const liquidationMultiplier = bigIntToBigDecimal(cauldron.collaterizationRate, 5);
    return borrow.div(collateralShare).div(liquidationMultiplier);
}
