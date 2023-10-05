import { LevelFinanceMezzanine } from '../../generated/schema';
import { getOrCreateLevelFinance } from './get-or-create-level-finance';
import { LEVEL_FINANCE_MEZZANINE_LLP } from '../constants';
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from 'misc';

export function getOrCreateLevelFinanceMezzanine(): LevelFinanceMezzanine {
    let levelFinanceMezzanine = LevelFinanceMezzanine.load(LEVEL_FINANCE_MEZZANINE_LLP);

    if (levelFinanceMezzanine) return levelFinanceMezzanine;
    const levelFinance = getOrCreateLevelFinance();

    levelFinanceMezzanine = new LevelFinanceMezzanine(LEVEL_FINANCE_MEZZANINE_LLP);
    levelFinanceMezzanine.levelFinance = levelFinance.id;
    levelFinanceMezzanine.lpPriceUsd = BIGDECIMAL_ZERO;
    levelFinanceMezzanine.totalRewards = BIGINT_ZERO;
    levelFinanceMezzanine.save();

    return levelFinanceMezzanine;
}
