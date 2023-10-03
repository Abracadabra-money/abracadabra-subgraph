import { ClaimRewards, Deposit, MagicApeStaking } from '../../generated/MagicApeStaking/MagicApeStaking';
import { MAGIC_APE_ADDRESS, MAGIC_APE_STAKING_ADDRESS } from '../constants';
import { bigIntToBigDecimal, exponentBigNumber, numberToBigDecimals, BIGDECIMAL_ONE, DAYS_PER_YEAR } from 'misc';
import { getOrCreateMagicApe } from '../helpers/get-or-create-magic-ape';
import { Address, log } from '@graphprotocol/graph-ts';
import { getOrCreateMagicApeDailySnapshot } from '../helpers/get-or-create-magic-ape-daily-snapshot';
import { getOrCreateMagicApeHourySnapshot } from '../helpers/get-or-create-magic-ape-houry-snapshot';

export function handleLogClaimRewards(event: ClaimRewards): void {
    const address = event.params.recipient;

    if (!Address.fromString(MAGIC_APE_ADDRESS).equals(address)) return;

    const magicApe = getOrCreateMagicApe();
    const amount = bigIntToBigDecimal(event.params.amount);

    magicApe.totalRewards = magicApe.totalRewards.plus(amount);
    magicApe.save();

    const dailySnapshot = getOrCreateMagicApeDailySnapshot(event.block);
    dailySnapshot.rewards = dailySnapshot.rewards.plus(amount);
    dailySnapshot.save();

    const hourySnapshot = getOrCreateMagicApeHourySnapshot(event.block);
    hourySnapshot.rewards = hourySnapshot.rewards.plus(amount);
    hourySnapshot.save();
}

export function handleLogDeposit(event: Deposit): void {
    const magicApeStaking = MagicApeStaking.bind(Address.fromString(MAGIC_APE_STAKING_ADDRESS));
    const poolsuiCall = magicApeStaking.try_getPoolsUI();

    if (poolsuiCall.reverted) {
        log.warning('[handleLogDeposit] MagicApeStaking poolsUI failed', []);
        return;
    }

    const rewardPoolPerHour = bigIntToBigDecimal(poolsuiCall.value.value0.currentTimeRange.rewardsPerHour);
    const rewardPoolPerDay = rewardPoolPerHour.times(numberToBigDecimals(24));
    const stakedAmount = bigIntToBigDecimal(poolsuiCall.value.value0.stakedAmount);
    const apr = rewardPoolPerDay.div(stakedAmount).times(DAYS_PER_YEAR).times(numberToBigDecimals(100));

    const apy = exponentBigNumber(BIGDECIMAL_ONE.plus(apr.div(numberToBigDecimals(100)).div(numberToBigDecimals(730))), 730)
        .minus(numberToBigDecimals(1))
        .times(numberToBigDecimals(100));

    const dailySnapshot = getOrCreateMagicApeDailySnapshot(event.block);
    dailySnapshot.apr = apr;
    dailySnapshot.apy = apy;
    dailySnapshot.save();

    const hourySnapshot = getOrCreateMagicApeHourySnapshot(event.block);
    hourySnapshot.apr = apr;
    hourySnapshot.apy = apy;
    hourySnapshot.save();
}
