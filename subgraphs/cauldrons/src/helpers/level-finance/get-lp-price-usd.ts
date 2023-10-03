import { Address, BigDecimal } from '@graphprotocol/graph-ts';
import { LevelFinanceLiquidityPool } from '../../../generated/LevelFinance/LevelFinanceLiquidityPool';
import { LevelFinanceLPToken } from '../../../generated/LevelFinance/LevelFinanceLPToken';
import { LEVEL_FINANCE_LIQUIDITY_POOL_BSC } from '../../constants';
import { bigIntToBigDecimal } from '../../utils';

export function getLpPriceUsd(tranche: Address): BigDecimal {
    const liquidityPool = LevelFinanceLiquidityPool.bind(Address.fromString(LEVEL_FINANCE_LIQUIDITY_POOL_BSC));
    const lpToken = LevelFinanceLPToken.bind(tranche);
    const lpPrice = liquidityPool.getTrancheValue(tranche, true).div(lpToken.totalSupply());
    return bigIntToBigDecimal(lpPrice, 12);
}
