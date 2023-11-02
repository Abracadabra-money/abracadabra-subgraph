import { BigDecimal, ethereum } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/schema';
import { getOrCreateCauldronDailySnapshot, getOrCreateCauldronHourySnapshot } from '../cauldron';
import { getOrCreateProtocolDailySnapshot, getOrCreateProtocolHourySnapshot } from '../protocol';
import { getOrCreateProtocol } from '../protocol';
import { FeeType } from '../../constants';

export function updateFeesGenerated(cauldron: Cauldron, amount: BigDecimal, block: ethereum.Block, feeType: string): void {
    const protocolDailySnapshot = getOrCreateProtocolDailySnapshot(block);
    const protocolHourySnapshot = getOrCreateProtocolHourySnapshot(block);

    const cauldronDailySnapshot = getOrCreateCauldronDailySnapshot(cauldron, block);
    const cauldronHourySnapshot = getOrCreateCauldronHourySnapshot(cauldron, block);

    const protocol = getOrCreateProtocol();

    cauldron.totalFeesGenerated = cauldron.totalFeesGenerated.plus(amount);

    protocolDailySnapshot.feesGenerated = protocolDailySnapshot.feesGenerated.plus(amount);
    protocolHourySnapshot.feesGenerated = protocolHourySnapshot.feesGenerated.plus(amount);

    cauldronDailySnapshot.feesGenerated = cauldronDailySnapshot.feesGenerated.plus(amount);
    cauldronHourySnapshot.feesGenerated = cauldronHourySnapshot.feesGenerated.plus(amount);

    protocol.totalFeesGenerated = protocol.totalFeesGenerated.plus(amount);

    if (feeType == FeeType.BORROW) {
        protocolDailySnapshot.borrowFeesGenerated = protocolDailySnapshot.borrowFeesGenerated.plus(amount);
        protocolHourySnapshot.borrowFeesGenerated = protocolHourySnapshot.borrowFeesGenerated.plus(amount);

        cauldronDailySnapshot.borrowFeesGenerated = cauldronDailySnapshot.borrowFeesGenerated.plus(amount);
        cauldronHourySnapshot.borrowFeesGenerated = cauldronHourySnapshot.borrowFeesGenerated.plus(amount);

        cauldron.borrowFeesGenerated = cauldron.borrowFeesGenerated.plus(amount);
        protocol.borrowFeesGenerated = protocol.borrowFeesGenerated.plus(amount);
    }

    if (feeType == FeeType.INTEREST) {
        protocolDailySnapshot.interestFeesGenerated = protocolDailySnapshot.interestFeesGenerated.plus(amount);
        protocolHourySnapshot.interestFeesGenerated = protocolHourySnapshot.interestFeesGenerated.plus(amount);

        cauldronDailySnapshot.interestFeesGenerated = cauldronDailySnapshot.interestFeesGenerated.plus(amount);
        cauldronHourySnapshot.interestFeesGenerated = cauldronHourySnapshot.interestFeesGenerated.plus(amount);

        cauldron.interestFeesGenerated = cauldron.interestFeesGenerated.plus(amount);
        protocol.interestFeesGenerated = protocol.interestFeesGenerated.plus(amount);
    }

    if (feeType == FeeType.LIQUADATION) {
        protocolDailySnapshot.liquidationFeesGenerated = protocolDailySnapshot.liquidationFeesGenerated.plus(amount);
        protocolHourySnapshot.liquidationFeesGenerated = protocolHourySnapshot.liquidationFeesGenerated.plus(amount);

        cauldronDailySnapshot.liquidationFeesGenerated = cauldronDailySnapshot.liquidationFeesGenerated.plus(amount);
        cauldronHourySnapshot.liquidationFeesGenerated = cauldronHourySnapshot.liquidationFeesGenerated.plus(amount);

        cauldron.liquidationFeesGenerated = cauldron.liquidationFeesGenerated.plus(amount);
        protocol.liquidationFeesGenerated = protocol.liquidationFeesGenerated.plus(amount);
    }

    protocolDailySnapshot.save();
    protocolHourySnapshot.save();

    cauldronDailySnapshot.save();
    cauldronHourySnapshot.save();

    cauldron.save();
    protocol.save();
}
