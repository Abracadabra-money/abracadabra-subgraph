import { getBentoBoxAddress } from "../get-bento-box-address";
import { getDegenBoxAddress } from "../get-degen-box-address";
import { Address, BigInt, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { getOrCreateProtocol } from "../get-or-create-protocol";
import { DegenBox } from "../../../generated/DegenBox/DegenBox";
import { getOrCreateDailySnapshot } from "../get-or-create-daily-snapshot";
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from "../../constants";
import { getCauldron } from "../cauldron";
import { getOrCreateCollateral } from "../get-or-create-collateral";
import { bigIntToBigDecimal, readValue } from "../../utils";

export function updateTvl(block: ethereum.Block): void{
    const protocol = getOrCreateProtocol();

    const bentoboxAddress = getBentoBoxAddress(dataSource.network());
    const bentobox = DegenBox.bind(Address.fromString(bentoboxAddress));

    const degenboxAddress = getDegenBoxAddress(dataSource.network());
    const degenbox = DegenBox.bind(Address.fromString(degenboxAddress));

    const dailySnapshot = getOrCreateDailySnapshot(block);
    let totalValueLockedUsd = BIGDECIMAL_ZERO;

    for(let i = 0; i < protocol.cauldronIds.length; i++){
        const cauldronId = protocol.cauldronIds[i];
        const cauldron = getCauldron(cauldronId);
        if(!cauldron){
            continue;
        }

        const collateral = getOrCreateCollateral(Address.fromString(cauldron.collateral));

        const bentoBoxCall: BigInt = readValue<BigInt>(bentobox.try_balanceOf(Address.fromString(collateral.id),Address.fromString(cauldronId)), BIGINT_ZERO);
        const degenBoxCall: BigInt = readValue<BigInt>(degenbox.try_balanceOf(Address.fromString(collateral.id),Address.fromString(cauldronId)), BIGINT_ZERO);

        const marketTVL = bigIntToBigDecimal(bentoBoxCall.plus(degenBoxCall), collateral.decimals).times(cauldron.collateralPriceUsd);
        totalValueLockedUsd = totalValueLockedUsd.plus(marketTVL);
    }

    dailySnapshot.totalValueLockedUsd = totalValueLockedUsd;
    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;
    dailySnapshot.save();

    protocol.totalValueLockedUsd = totalValueLockedUsd;
    protocol.save();
}