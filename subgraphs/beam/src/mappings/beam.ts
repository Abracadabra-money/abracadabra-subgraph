import { SendToChain, ReceiveFromChain } from '../../generated/Beam/LzIndirectOFTV2';
import { createBeamSendTx } from '../helpers/create-beam-send-tx';
import { createBeamReceiveTx } from '../helpers/create-beam-receive-tx';
import { getOrCreateBeam } from '../helpers/get-or-create-beam';
import { getOrCreateBeamDailySnapshot } from '../helpers/get-or-create-beam-daily-snapshot';
import { getOrCreateBeamHourySnapshot } from '../helpers/get-or-create-beam-houry-snapshot';
import { bigIntToBigDecimal, BIGINT_ONE } from 'misc';

export function handleSendToChain(event: SendToChain): void {
    createBeamSendTx(event);

    const amount = bigIntToBigDecimal(event.params._amount);

    const beam = getOrCreateBeam();
    beam.volume = beam.volume.plus(amount);
    beam.sendCount = beam.sendCount.plus(BIGINT_ONE);
    beam.sendVolume = beam.sendVolume.plus(amount);
    beam.save();

    const dailySnapshot = getOrCreateBeamDailySnapshot(event.block);
    dailySnapshot.volume = dailySnapshot.volume.plus(amount);
    dailySnapshot.sendCount = dailySnapshot.sendCount.plus(BIGINT_ONE);
    dailySnapshot.sendVolume = dailySnapshot.sendVolume.plus(amount);
    dailySnapshot.save();

    const hourySnapshot = getOrCreateBeamHourySnapshot(event.block);
    hourySnapshot.volume = hourySnapshot.volume.plus(amount);
    hourySnapshot.sendCount = hourySnapshot.sendCount.plus(BIGINT_ONE);
    hourySnapshot.sendVolume = hourySnapshot.sendVolume.plus(amount);
    hourySnapshot.save();
}

export function handleReceiveFromChain(event: ReceiveFromChain): void{
    createBeamReceiveTx(event);

    const amount = bigIntToBigDecimal(event.params._amount);

    const beam = getOrCreateBeam();
    beam.volume = beam.volume.plus(amount);
    beam.receiveCount = beam.receiveCount.plus(BIGINT_ONE);
    beam.receiveVolume = beam.receiveVolume.plus(amount);
    beam.save();

    const dailySnapshot = getOrCreateBeamDailySnapshot(event.block);
    dailySnapshot.volume = dailySnapshot.volume.plus(amount);
    dailySnapshot.receiveCount = dailySnapshot.receiveCount.plus(BIGINT_ONE);
    dailySnapshot.receiveVolume = dailySnapshot.receiveVolume.plus(amount);
    dailySnapshot.save();

    const hourySnapshot = getOrCreateBeamHourySnapshot(event.block);
    hourySnapshot.volume = hourySnapshot.volume.plus(amount);
    hourySnapshot.receiveCount = hourySnapshot.receiveCount.plus(BIGINT_ONE);
    hourySnapshot.receiveVolume = hourySnapshot.receiveVolume.plus(amount);
    hourySnapshot.save();
}