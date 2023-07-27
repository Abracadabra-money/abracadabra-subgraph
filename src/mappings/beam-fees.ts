import { LogWrapperFeeWithdrawn } from '../../generated/BeamFees/IOFTWrapper';
import { getOrCreateFinancialProtocolMetricsDailySnapshot, getOrCreateProtocol } from '../helpers/protocol';
import { bigIntToBigDecimal } from '../utils';

export function handleLogWrapperFeeWithdrawn(event: LogWrapperFeeWithdrawn): void {
    const protocolDailySnapshot = getOrCreateFinancialProtocolMetricsDailySnapshot(event.block);

    const protocol = getOrCreateProtocol();

    const amount = bigIntToBigDecimal(event.params.amount);

    protocolDailySnapshot.feesGenerated = protocolDailySnapshot.feesGenerated.plus(amount);
    protocol.totalFeesGenerated = protocol.totalFeesGenerated.plus(amount);

    protocolDailySnapshot.beamFeesGenerated = protocolDailySnapshot.beamFeesGenerated.plus(amount);

    protocolDailySnapshot.save();
    protocol.save();
}
