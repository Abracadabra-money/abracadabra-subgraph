import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { getOrCreateLevelFinanceDailySnapshot } from '../get-or-create-level-finance-daily-snapshot';
import { getOrCreateLevelFinanceHourySnapshot } from '../get-or-create-level-finance-houry-snapshot';
import { getOrCreateLevelFinanceJunior } from '../get-or-create-level-finance-junior';
import { getOrCreateLevelFinanceMezzanine } from '../get-or-create-level-finance-mezzanine';
import { getOrCreateLevelFinanceSenior } from '../get-or-create-level-finance-senior';
import { getLpPriceUsd } from '../get-lp-price-usd';

import { LEVEL_FINANCE_JUNIOR_LLP, LEVEL_FINANCE_SENIOR_LLP, LEVEL_FINANCE_MEZZANINE_LLP, MAGIC_LLP_JUNIOR, MAGIC_LLP_MEZZANINE, MAGIC_LLP_SENIOR } from '../../constants';

import { getLevelFinanceApy } from '../get-level-finance-apy';

export function updateLevelFinanceRewards(vault: Address, assetAmount: BigInt, block: ethereum.Block): void {
    const dailySnapshot = getOrCreateLevelFinanceDailySnapshot(block);
    const hourySnapshot = getOrCreateLevelFinanceHourySnapshot(block);

    const junior = getOrCreateLevelFinanceJunior();
    const mezzanine = getOrCreateLevelFinanceMezzanine();
    const senior = getOrCreateLevelFinanceSenior();

    junior.lpPriceUsd = getLpPriceUsd(Address.fromString(LEVEL_FINANCE_JUNIOR_LLP));
    mezzanine.lpPriceUsd = getLpPriceUsd(Address.fromString(LEVEL_FINANCE_MEZZANINE_LLP));
    senior.lpPriceUsd = getLpPriceUsd(Address.fromString(LEVEL_FINANCE_SENIOR_LLP));

    if (vault.equals(Address.fromString(MAGIC_LLP_JUNIOR))) {
        junior.totalRewards = junior.totalRewards.plus(assetAmount);
        dailySnapshot.juniorRewards = dailySnapshot.juniorRewards.plus(assetAmount);
        hourySnapshot.juniorRewards = hourySnapshot.juniorRewards.plus(assetAmount);
    }

    if (vault.equals(Address.fromString(MAGIC_LLP_MEZZANINE))) {
        mezzanine.totalRewards = mezzanine.totalRewards.plus(assetAmount);
        dailySnapshot.mezzanineRewards = dailySnapshot.mezzanineRewards.plus(assetAmount);
        hourySnapshot.mezzanineRewards = hourySnapshot.mezzanineRewards.plus(assetAmount);
    }

    if (vault.equals(Address.fromString(MAGIC_LLP_SENIOR))) {
        senior.totalRewards = senior.totalRewards.plus(assetAmount);
        dailySnapshot.seniorRewards = dailySnapshot.seniorRewards.plus(assetAmount);
        hourySnapshot.seniorRewards = hourySnapshot.seniorRewards.plus(assetAmount);
    }

    junior.save();
    mezzanine.save();
    senior.save();

    const juniorApy = getLevelFinanceApy(Address.fromString(MAGIC_LLP_JUNIOR), dailySnapshot.juniorRewards, junior.lpPriceUsd);
    dailySnapshot.juniorApy = juniorApy;
    hourySnapshot.juniorApy = juniorApy;

    const mezzanineApy = getLevelFinanceApy(Address.fromString(MAGIC_LLP_MEZZANINE), dailySnapshot.mezzanineRewards, mezzanine.lpPriceUsd);
    dailySnapshot.mezzanineApy = mezzanineApy;
    hourySnapshot.mezzanineApy = juniorApy;

    const seniorApy = getLevelFinanceApy(Address.fromString(MAGIC_LLP_SENIOR), dailySnapshot.seniorRewards, senior.lpPriceUsd);
    dailySnapshot.seniorApy = seniorApy;
    hourySnapshot.seniorApy = seniorApy;

    dailySnapshot.save();
    hourySnapshot.save();
}
