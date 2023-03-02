import { ClaimRewards, Deposit, MagicApeStaking } from "../../generated/MagicApeStaking/MagicApeStaking";
import { MAGIC_APE, DEFAULT_DECIMALS, BIGDECIMAL_ONE, DAYS_PER_YEAR, MAGIC_APE_STAKING } from "../constants";
import { bigIntToBigDecimal, exponentBigNumber, numberToBigDecimals } from "../utils";
import { getOrCreateMagicApe } from "../helpers/magic-ape/get-or-create-magic-ape";
import { getOrCreateMagicApeRewardsDailySnapshot } from "../helpers/magic-ape/get-or-create-magic-ape-rewards-daily-snapshot";
import { Address, log } from "@graphprotocol/graph-ts";
import { getOrCreateMagicApeYieldDailySnapshot } from "../helpers/magic-ape/get-or-create-magic-ape-yield-daily-snapshot";

export function handleLogClaimRewards(event: ClaimRewards): void {
    const address = event.params.recipient;

    if(!Address.fromString(MAGIC_APE).equals(address)) return;

    const magicApe = getOrCreateMagicApe();
    const dailySnapshot = getOrCreateMagicApeRewardsDailySnapshot(event.block);
    const amount = bigIntToBigDecimal(event.params.amount, DEFAULT_DECIMALS);

    magicApe.totalRewards = magicApe.totalRewards.plus(amount);
    magicApe.save();

    dailySnapshot.rewards = dailySnapshot.rewards.plus(amount);
    dailySnapshot.blockNumber = event.block.number;
    dailySnapshot.timestamp = event.block.timestamp;
    dailySnapshot.save();
}

export function handleLogDeposit(event: Deposit): void {
    const magicApeStaking = MagicApeStaking.bind(Address.fromString(MAGIC_APE_STAKING));
    const poolsuiCall = magicApeStaking.try_getPoolsUI();

    if(poolsuiCall.reverted){
        log.warning("[handleLogDeposit] MagicApeStaking poolsUI failed", []);
        return;
    }

    const dailySnapshot = getOrCreateMagicApeYieldDailySnapshot(event.block);

    const rewardPoolPerHour = bigIntToBigDecimal(poolsuiCall.value.value0.currentTimeRange.rewardsPerHour, DEFAULT_DECIMALS);
    const rewardPoolPerDay = rewardPoolPerHour.times(numberToBigDecimals(24));
    const stakedAmount = bigIntToBigDecimal(poolsuiCall.value.value0.stakedAmount, DEFAULT_DECIMALS);
    const apr =  rewardPoolPerDay.div(stakedAmount).times(DAYS_PER_YEAR).times(numberToBigDecimals(100));

    const apy = (exponentBigNumber(BIGDECIMAL_ONE.plus(apr.div(numberToBigDecimals(100)).div(numberToBigDecimals(730))), 730).minus(numberToBigDecimals(1))).times(numberToBigDecimals(100));

    dailySnapshot.apr = apr;
    dailySnapshot.apy = apy;
    dailySnapshot.timestamp = event.block.timestamp;
    dailySnapshot.blockNumber = event.block.timestamp;
    dailySnapshot.save();
}