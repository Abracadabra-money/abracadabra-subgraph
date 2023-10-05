import { LevelFinanceSenior } from '../../generated/schema';
import { getOrCreateLevelFinance } from './get-or-create-level-finance';
import { LEVEL_FINANCE_SENIOR_LLP } from '../constants';
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';

export function getOrCreateLevelFinanceSenior(): LevelFinanceSenior {
    let levelFinanceSenior = LevelFinanceSenior.load(LEVEL_FINANCE_SENIOR_LLP);

    if (levelFinanceSenior) return levelFinanceSenior;
    const levelFinance = getOrCreateLevelFinance();

    levelFinanceSenior = new LevelFinanceSenior(LEVEL_FINANCE_SENIOR_LLP);
    levelFinanceSenior.levelFinance = levelFinance.id;
    levelFinanceSenior.lpPriceUsd = BIGDECIMAL_ZERO;
    levelFinanceSenior.totalRewards = BIGINT_ZERO;
    levelFinanceSenior.save();

    return levelFinanceSenior;
}
