import { LogHarvest } from '../../generated/LevelFinance/MagicLevelHarvestor';
import { updateLevelFinanceRewards } from '../helpers/updates';

export function handleLogHarvest(event: LogHarvest): void {
    updateLevelFinanceRewards(event.params.vault, event.params.amount, event.block);
}
