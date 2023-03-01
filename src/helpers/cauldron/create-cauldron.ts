import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Cauldron as CauldronSchema } from "../../../generated/schema";
import { Cauldron as CauldronTemplate } from "../../../generated/templates/Cauldron/Cauldron";
import { BIGINT_ZERO, BIGDECIMAL_ZERO } from "../../constants";
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
        CauldronEntity.name = collateral.symbol;
        CauldronEntity.createdTimestamp = blockTimestamp;
        CauldronEntity.createdBlockNumber = blockNumber;
        CauldronEntity.collateralPriceUsd = collateral.lastPriceUSD!;
        CauldronEntity.exchangeRate = BIGINT_ZERO;
        CauldronEntity.protocol = protocol.id;
        CauldronEntity.isActive = false;
        CauldronEntity.deprecated = false;
        CauldronEntity.lastActive = blockTimestamp;
        CauldronEntity.totalFeesGenerated = BIGDECIMAL_ZERO;
        CauldronEntity.totalLiquidationsCount = 0;
        CauldronEntity.feesEarned = BIGINT_ZERO;

        const oracleCall = CauldronContract.try_oracle();
        if(!oracleCall.reverted){
            CauldronEntity.oracle = oracleCall.value;
        }

        const oracleDataCall = CauldronContract.try_oracleData();
        if(!oracleDataCall.reverted){
            CauldronEntity.oracleData = oracleDataCall.value.toHexString();
        }

        CauldronEntity.save();

        protocol.totalCauldronCount += 1;

        const cauldronIds = protocol.cauldronIds;
        cauldronIds.push(cauldronAddress.toHexString());
        protocol.cauldronIds = cauldronIds;
        
        protocol.save();
    }
};