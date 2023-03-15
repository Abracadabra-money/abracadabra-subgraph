import { BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/schema';
import { getOrCreateFinanceialCauldronMetricsDailySnapshot } from '../cauldron/get-or-create-financeial-cauldron-metrics-daily-snapshot';
import { getOrCreateFinanceialProtocolMetricsDailySnapshot } from '../protocol/get-or-create-financeial-protocol-metrics-daily-snapshot';
import { getOrCreateProtocol } from '../protocol';

export function updateFeesGenerated(cauldron: Cauldron, amount: BigDecimal, block: ethereum.Block): void {
    const protocolDailySnapshot = getOrCreateFinanceialProtocolMetricsDailySnapshot(block);
    const cauldronDailySnapshot = getOrCreateFinanceialCauldronMetricsDailySnapshot(cauldron, block);

    const protocol = getOrCreateProtocol();

    cauldron.totalFeesGenerated = cauldron.totalFeesGenerated.plus(amount);
    cauldron.save();

    protocolDailySnapshot.feesGenerated = protocolDailySnapshot.feesGenerated.plus(amount);
    protocolDailySnapshot.save();

    cauldronDailySnapshot.feesGenerated = cauldronDailySnapshot.feesGenerated.plus(amount);
    cauldronDailySnapshot.save();

    protocol.totalFeesGenerated = protocol.totalFeesGenerated.plus(amount);
    protocol.save();
}
