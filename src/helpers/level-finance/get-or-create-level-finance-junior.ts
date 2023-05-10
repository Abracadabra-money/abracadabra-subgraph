import { LevelFinanceJunior } from '../../../generated/schema';
import { getOrCreateLevelFinance } from './get-or-create-level-finance';
import { BIGDECIMAL_ZERO, BIGINT_ZERO, LEVEL_FINANCE_JUNIOR_LLP_BSC } from '../../constants';

export function getOrCreateLevelFinanceJunior(): LevelFinanceJunior {
    let levelFinanceJunior = LevelFinanceJunior.load(LEVEL_FINANCE_JUNIOR_LLP_BSC);

    if (levelFinanceJunior) return levelFinanceJunior;
    const levelFinance = getOrCreateLevelFinance();

    levelFinanceJunior = new LevelFinanceJunior(LEVEL_FINANCE_JUNIOR_LLP_BSC);
    levelFinanceJunior.levelFinance = levelFinance.id;
    levelFinanceJunior.lpPriceUsd = BIGDECIMAL_ZERO;
    levelFinanceJunior.totalRewards = BIGINT_ZERO;
    levelFinanceJunior.save();

    return levelFinanceJunior;
}
