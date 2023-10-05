import { bigIntToBigDecimal } from 'misc';
import { LogWrapperFeeWithdrawn } from '../../generated/Wrapper/OFTWrapper';
import { getOrCreateBeam } from '../helpers/get-or-create-beam';
import { getOrCreateBeamDailySnapshot } from '../helpers/get-or-create-beam-daily-snapshot';
import { getOrCreateBeamHourySnapshot } from '../helpers/get-or-create-beam-houry-snapshot';

export function handleLogWrapperFeeWithdrawn(event: LogWrapperFeeWithdrawn): void {
    const beam = getOrCreateBeam();

    const amount = bigIntToBigDecimal(event.params.amount);

    beam.feesGenerated = beam.feesGenerated.plus(amount);
    beam.save();

    const dailySnapshot = getOrCreateBeamDailySnapshot(event.block);
    dailySnapshot.feesGenerated = dailySnapshot.feesGenerated.plus(amount);
    dailySnapshot.save();

    const hourySnapshot = getOrCreateBeamHourySnapshot(event.block);
    hourySnapshot.feesGenerated = dailySnapshot.feesGenerated.plus(amount);
    hourySnapshot.save();
}
