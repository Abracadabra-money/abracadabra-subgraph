import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import {
    getOrCreateLevelFinanceJunior,
    getOrCreateLevelFinanceMezzanine,
    getOrCreateLevelFinanceSenior,
    getLpPriceUsd,
    getOrCreateLevelFinanceDailySnapshot,
} from '../level-finance';
import {
    LEVEL_FINANCE_JUNIOR_LLP_BSC,
    LEVEL_FINANCE_SENIOR_LLP_BSC,
    LEVEL_FINANCE_MEZZANINE_LLP_BSC,
    MAGIC_LLP_JUNIOR_BSC,
    MAGIC_LLP_MEZZANINE_BSC,
    MAGIC_LLP_SENIOR_BSC,
} from '../../constants';
import { getLevelFinanceApy } from '../level-finance/get-level-finance-apy';

export function updateLevelFinanceRewards(vault: Address, assetAmount: BigInt, block: ethereum.Block) {
    const dailySnapshot = getOrCreateLevelFinanceDailySnapshot(block);

    const junior = getOrCreateLevelFinanceJunior();
    const mezzanine = getOrCreateLevelFinanceMezzanine();
    const senior = getOrCreateLevelFinanceSenior();

    junior.lpPriceUsd = getLpPriceUsd(Address.fromString(LEVEL_FINANCE_JUNIOR_LLP_BSC));
    mezzanine.lpPriceUsd = getLpPriceUsd(Address.fromString(LEVEL_FINANCE_MEZZANINE_LLP_BSC));
    senior.lpPriceUsd = getLpPriceUsd(Address.fromString(LEVEL_FINANCE_SENIOR_LLP_BSC));

    if (vault.equals(Address.fromString(MAGIC_LLP_JUNIOR_BSC))) {
        junior.totalRewards = junior.totalRewards.plus(assetAmount);
        dailySnapshot.juniorRewards = dailySnapshot.juniorRewards.plus(assetAmount);
    }

    if (vault.equals(Address.fromString(MAGIC_LLP_MEZZANINE_BSC))) {
        mezzanine.totalRewards = mezzanine.totalRewards.plus(assetAmount);
        dailySnapshot.mezzanineRewards = dailySnapshot.mezzanineRewards.plus(assetAmount);
    }

    if (vault.equals(Address.fromString(MAGIC_LLP_SENIOR_BSC))) {
        senior.totalRewards = senior.totalRewards.plus(assetAmount);
        dailySnapshot.seniorRewards = dailySnapshot.seniorRewards.plus(assetAmount);
    }

    junior.save();
    mezzanine.save();
    senior.save();

    dailySnapshot.juniorApy = getLevelFinanceApy(Address.fromString(LEVEL_FINANCE_JUNIOR_LLP_BSC), dailySnapshot.juniorRewards, junior.lpPriceUsd);
    dailySnapshot.mezzanineApy = getLevelFinanceApy(Address.fromString(LEVEL_FINANCE_MEZZANINE_LLP_BSC), dailySnapshot.mezzanineRewards, mezzanine.lpPriceUsd);
    dailySnapshot.seniorApy = getLevelFinanceApy(Address.fromString(LEVEL_FINANCE_SENIOR_LLP_BSC), dailySnapshot.seniorRewards, senior.lpPriceUsd);

    dailySnapshot.save();
}
