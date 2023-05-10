import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { bigIntToBigDecimal } from '../../utils';
import { MagicLevel } from '../../../generated/LevelFinance/MagicLevel';
import { BIGDECIMAL_ONE_HUNDRED, DAYS_PER_YEAR } from '../../constants';

export function getLevelFinanceApy(tranche: Address, rewards: BigInt, priceUsd: BigDecimal): BigDecimal {
    const rewardsUsd = priceUsd.times(bigIntToBigDecimal(rewards));
    const trancheContract = MagicLevel.bind(tranche);
    const totalSupply = trancheContract.totalSupply();
    const dayReward = rewardsUsd.div(bigIntToBigDecimal(totalSupply));
    return dayReward.times(DAYS_PER_YEAR).times(BIGDECIMAL_ONE_HUNDRED);
}
