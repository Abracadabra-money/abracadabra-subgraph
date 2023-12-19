import { Address, BigInt } from '@graphprotocol/graph-ts';
import { BentoBox } from '../../../generated/templates/Cauldron/BentoBox';
import { Cauldron } from '../../../generated/templates/Cauldron/Cauldron';

export function getAmount(cauldron: Address, share: BigInt, roundUp: boolean): BigInt {
    const cauldronContract = Cauldron.bind(cauldron);
    const bentoBoxContract = BentoBox.bind(cauldronContract.bentoBox());
    return bentoBoxContract.toAmount(cauldronContract.collateral(), share, roundUp);
}
