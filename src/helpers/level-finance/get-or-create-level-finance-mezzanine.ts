import { LevelFinanceMezzanine } from '../../../generated/schema';
import { getOrCreateLevelFinance } from './get-or-create-level-finance';
import { BIGDECIMAL_ZERO, BIGINT_ZERO, LEVEL_FINANCE_MEZZANINE_LLP_BSC } from '../../constants';

export function getOrCreateLevelFinanceMezzanine(): LevelFinanceMezzanine {
    let levelFinanceMezzanine = LevelFinanceMezzanine.load(LEVEL_FINANCE_MEZZANINE_LLP_BSC);

    if (levelFinanceMezzanine) return levelFinanceMezzanine;
    const levelFinance = getOrCreateLevelFinance();

    levelFinanceMezzanine = new LevelFinanceMezzanine(LEVEL_FINANCE_MEZZANINE_LLP_BSC);
    levelFinanceMezzanine.levelFinance = levelFinance.id;
    levelFinanceMezzanine.lpPriceUsd = BIGDECIMAL_ZERO;
    levelFinanceMezzanine.totalRewards = BIGINT_ZERO;

    return levelFinanceMezzanine;
}
