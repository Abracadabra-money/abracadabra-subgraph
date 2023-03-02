import { MagicApe } from "../../../generated/schema";
import { BIGDECIMAL_ZERO } from "../../constants";
import { MAGIC_APE } from "../../constants";

export function getOrCreateMagicApe(): MagicApe {
    let magicApe = MagicApe.load(MAGIC_APE);
    if(magicApe) return magicApe;
    magicApe = new MagicApe(MAGIC_APE);

    magicApe.totalRewards = BIGDECIMAL_ZERO;
    magicApe.save();
    return magicApe;
}