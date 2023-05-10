import { BigDecimal, ethereum } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/schema';
import { getOrCreateFinancialCauldronMetricsDailySnapshot } from '../cauldron/get-or-create-financial-cauldron-metrics-daily-snapshot';
import { getOrCreateFinancialProtocolMetricsDailySnapshot } from '../protocol/get-or-create-financial-protocol-metrics-daily-snapshot';
import { getOrCreateProtocol } from '../protocol';
import { FeeType } from '../../constants';

export function updateFeesGenerated(cauldron: Cauldron, amount: BigDecimal, block: ethereum.Block, feeType: string): void {
    const protocolDailySnapshot = getOrCreateFinancialProtocolMetricsDailySnapshot(block);
    const cauldronDailySnapshot = getOrCreateFinancialCauldronMetricsDailySnapshot(cauldron, block);

    const protocol = getOrCreateProtocol();

    cauldron.totalFeesGenerated = cauldron.totalFeesGenerated.plus(amount);
    cauldron.save();

    protocolDailySnapshot.feesGenerated = protocolDailySnapshot.feesGenerated.plus(amount);
    cauldronDailySnapshot.feesGenerated = cauldronDailySnapshot.feesGenerated.plus(amount);
    protocol.totalFeesGenerated = protocol.totalFeesGenerated.plus(amount);

    if (feeType == FeeType.BORROW) {
        protocolDailySnapshot.borrowFeesGenerated = protocolDailySnapshot.borrowFeesGenerated.plus(amount);
        cauldronDailySnapshot.borrowFeesGenerated = cauldronDailySnapshot.borrowFeesGenerated.plus(amount);
    }

    if (feeType == FeeType.INTEREST) {
        protocolDailySnapshot.interestFeesGenerated = protocolDailySnapshot.interestFeesGenerated.plus(amount);
        cauldronDailySnapshot.interestFeesGenerated = cauldronDailySnapshot.interestFeesGenerated.plus(amount);
    }

    if (feeType == FeeType.LIQUADATION) {
        protocolDailySnapshot.liquidationFeesGenerated = protocolDailySnapshot.liquidationFeesGenerated.plus(amount);
        cauldronDailySnapshot.liquidationFeesGenerated = cauldronDailySnapshot.liquidationFeesGenerated.plus(amount);
    }

    protocolDailySnapshot.save();
    cauldronDailySnapshot.save();
    protocol.save();
}
