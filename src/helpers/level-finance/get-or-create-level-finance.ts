import { LevelFinance } from '../../../generated/schema';
import { MAGIC_LEVEL_HARVESTOR_BSC } from '../../constants';
import { getOrCreateProtocol } from '../protocol';

export function getOrCreateLevelFinance(): LevelFinance {
    let levelFinance = LevelFinance.load(MAGIC_LEVEL_HARVESTOR_BSC);

    if (levelFinance) return levelFinance;
    const protocol = getOrCreateProtocol();

    levelFinance = new LevelFinance(MAGIC_LEVEL_HARVESTOR_BSC);
    levelFinance.protocol = protocol.id;

    return levelFinance;
}
