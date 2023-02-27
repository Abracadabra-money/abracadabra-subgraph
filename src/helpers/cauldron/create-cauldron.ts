import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Cauldron as CauldronSchema } from "../../../generated/schema";
import { Cauldron as CauldronTemplate } from "../../../generated/templates/Cauldron/Cauldron";
import { BIGINT_ZERO } from "../../constants";
import { getOrCreateCollateral } from "../get-or-create-collateral";
import { getOrCreateProtocol } from "../get-or-create-protocol";

export function createCauldron(cauldronAddress: Address, blockNumber: BigInt, blockTimestamp: BigInt ): void{
    const CauldronContract = CauldronTemplate.bind(cauldronAddress);
    const collateralCall = CauldronContract.try_collateral();
    if(collateralCall.reverted || !collateralCall.value) return;

    const CauldronEntity = new CauldronSchema(cauldronAddress.toHexString());
    const protocol = getOrCreateProtocol();

    if(!collateralCall.reverted){
        const collateral = getOrCreateCollateral(collateralCall.value);
        CauldronEntity.collateral = collateral.id;
        CauldronEntity.name = collateral.name;
        CauldronEntity.createdTimestamp = blockTimestamp;
        CauldronEntity.createdBlockNumber = blockNumber;
        CauldronEntity.collateralPriceUsd = collateral.lastPriceUSD!;
        CauldronEntity.exchangeRate = BIGINT_ZERO;
        CauldronEntity.protocol = protocol.id;
        CauldronEntity.save();

        protocol.totalCauldronCount += 1;
        protocol.save();
    }
};