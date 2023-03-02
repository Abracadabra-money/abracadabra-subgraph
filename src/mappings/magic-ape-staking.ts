import { ClaimRewards } from "../../generated/MagicApeStaking/MagicApeStaking";
import { MAGIC_APE, DEFAULT_DECIMALS } from "../constants";
import { bigIntToBigDecimal } from "../utils";
import { getOrCreateMagicApe } from "../helpers/magic-ape/get-or-create-magic-ape";
import { getOrCreateMagicApeRewardsDailySnapshot } from "../helpers/magic-ape/get-or-create-magic-ape-rewards-daily-snapshot";

export function handleLogClaimRewards(event: ClaimRewards): void {
    const address = event.params.recipient.toHex().toLowerCase();
    if(address !== MAGIC_APE) return;

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