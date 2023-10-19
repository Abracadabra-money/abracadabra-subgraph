import { LevelFinanceJunior } from '../../generated/schema';
import { getOrCreateLevelFinance } from './get-or-create-level-finance';
import { LEVEL_FINANCE_JUNIOR_LLP } from '../constants';
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';

export function getOrCreateLevelFinanceJunior(): LevelFinanceJunior {
    let levelFinanceJunior = LevelFinanceJunior.load(LEVEL_FINANCE_JUNIOR_LLP);

    if (levelFinanceJunior) return levelFinanceJunior;
    const levelFinance = getOrCreateLevelFinance();

    levelFinanceJunior = new LevelFinanceJunior(LEVEL_FINANCE_JUNIOR_LLP);
    levelFinanceJunior.levelFinance = levelFinance.id;
    levelFinanceJunior.lpPriceUsd = BIGDECIMAL_ZERO;
    levelFinanceJunior.totalRewards = BIGINT_ZERO;
    levelFinanceJunior.save();

    return levelFinanceJunior;
}
