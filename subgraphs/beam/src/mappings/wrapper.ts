import { bigIntToBigDecimal } from 'misc';
import { LogWrapperFeeWithdrawn } from '../../generated/Wrapper/OFTWrapper';
import { getOrCreateBeam } from '../helpers/get-or-create-beam';
import { getOrCreateBeamDailySnapshot } from '../helpers/get-or-create-beam-daily-snapshot';
import { getOrCreateBeamHourySnapshot } from '../helpers/get-or-create-beam-houry-snapshot';
import { amountToUsd } from '../helpers/amount-to-usd';

export function handleLogWrapperFeeWithdrawn(event: LogWrapperFeeWithdrawn): void {
    const beam = getOrCreateBeam();

    const amount = bigIntToBigDecimal(event.params.amount);
    const amountUsd = amountToUsd(amount);

    beam.feesGenerated = beam.feesGenerated.plus(amount);
    beam.feesGeneratedUsd = beam.feesGeneratedUsd.plus(amountUsd);
    beam.save();

    const dailySnapshot = getOrCreateBeamDailySnapshot(event.block);
    dailySnapshot.feesGenerated = dailySnapshot.feesGenerated.plus(amount);
    dailySnapshot.feesGeneratedUsd = dailySnapshot.feesGeneratedUsd.plus(amountUsd);
    dailySnapshot.save();

    const hourySnapshot = getOrCreateBeamHourySnapshot(event.block);
    hourySnapshot.feesGenerated = hourySnapshot.feesGenerated.plus(amount);
    hourySnapshot.feesGeneratedUsd = hourySnapshot.feesGeneratedUsd.plus(amountUsd);
    hourySnapshot.save();
}
