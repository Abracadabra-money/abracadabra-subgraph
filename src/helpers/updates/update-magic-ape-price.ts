import { Address, ethereum, log } from "@graphprotocol/graph-ts";
import { MagicApe } from "../../../generated/MagicApe/MagicApe";
import { MAGIC_APE, DEFAULT_DECIMALS } from "../../constants";
import { bigIntToBigDecimal, exponentToBigInt } from "../../utils";
import { getApePrice } from "../get-ape-price";
import { getOrCreateMagicApe } from "../magic-ape/get-or-create-magic-ape";
import { getOrCreateMagicApePriceDailySnapshot } from "../magic-ape/get-or-create-magic-ape-price-daily-snapshot";

export function updateMagicApePrice(block: ethereum.Block): void{
    const magicApe = getOrCreateMagicApe();
    const apePrice = getApePrice();
    const contract = MagicApe.bind(Address.fromString(MAGIC_APE));
    const dailySnapshot = getOrCreateMagicApePriceDailySnapshot(block);

    const convertToAssetsCall = contract.try_convertToAssets(exponentToBigInt(DEFAULT_DECIMALS));
    if(convertToAssetsCall.reverted){
        log.warning("[updateMagicApePrice] MagicApe convertToAssets failed", []);
        return;
    }

    const convertToAssets = bigIntToBigDecimal(convertToAssetsCall.value, DEFAULT_DECIMALS);

    dailySnapshot.blockNumber = block.number;
    dailySnapshot.timestamp = block.timestamp;
    dailySnapshot.magicApe = magicApe.id;
    dailySnapshot.price = convertToAssets.times(apePrice);
    dailySnapshot.save();
}