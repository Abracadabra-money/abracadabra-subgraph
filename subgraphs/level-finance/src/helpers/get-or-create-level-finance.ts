import { LevelFinance } from '../../generated/schema';
import { MAGIC_LEVEL_HARVESTOR } from '../constants';

export function getOrCreateLevelFinance(): LevelFinance {
    let levelFinance = LevelFinance.load(MAGIC_LEVEL_HARVESTOR);

    if (levelFinance) return levelFinance;

    levelFinance = new LevelFinance(MAGIC_LEVEL_HARVESTOR);
    levelFinance.save();

    return levelFinance;
}
