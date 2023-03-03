import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/templates/Cauldron/Cauldron';
import { CauldronV1 } from '../../../generated/templates/Cauldron/CauldronV1';
import { BIGINT_ZERO } from '../../constants';

export function getFeesEarned(address: Address): BigInt {
    let feesEarned = BIGINT_ZERO;

    const cauldron = Cauldron.bind(address);
    const accrueInfoCall = cauldron.try_accrueInfo();
    if (!accrueInfoCall.reverted) {
        feesEarned = accrueInfoCall.value.getFeesEarned();
    } else {
        const cauldronV1 = CauldronV1.bind(address);
        const accrueInfoV1Call = cauldronV1.try_accrueInfo();

        if (!accrueInfoV1Call.reverted) {
            feesEarned = accrueInfoV1Call.value.getFeesEarned();
        }
    }

    return feesEarned;
}
