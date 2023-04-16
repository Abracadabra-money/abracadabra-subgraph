import { LevelFinanceSenior } from '../../../generated/schema';
import { getOrCreateLevelFinance } from './get-or-create-level-finance';
import { BIGDECIMAL_ZERO, BIGINT_ZERO, LEVEL_FINANCE_SENIOR_LLP_BSC } from '../../constants';

export function getOrCreateLevelFinanceSenior(): LevelFinanceSenior {
    let levelFinanceSenior = LevelFinanceSenior.load(LEVEL_FINANCE_SENIOR_LLP_BSC);

    if (levelFinanceSenior) return levelFinanceSenior;
    const levelFinance = getOrCreateLevelFinance();

    levelFinanceSenior = new LevelFinanceSenior(LEVEL_FINANCE_SENIOR_LLP_BSC);
    levelFinanceSenior.levelFinance = levelFinance.id;
    levelFinanceSenior.lpPriceUsd = BIGDECIMAL_ZERO;
    levelFinanceSenior.totalRewards = BIGINT_ZERO;

    return levelFinanceSenior;
}
