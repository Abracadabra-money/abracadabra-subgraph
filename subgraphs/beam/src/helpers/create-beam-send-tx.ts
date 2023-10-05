import { SendToChain } from '../../generated/Beam/LzIndirectOFTV2';
import { BeamSendTx } from '../../generated/schema';
import { getOrCreateBeam } from './get-or-create-beam';
import { bigIntToBigDecimal } from 'misc';

export function createBeamSendTx(event: SendToChain): void {
    const beam = getOrCreateBeam();

    const tx = new BeamSendTx(event.transaction.hash.toHexString());
    tx.beam = beam.id;
    tx.dstChainId = event.params._dstChainId;
    tx.from = event.params._from.toHexString();
    tx.to = event.params._toAddress.toHexString();
    tx.amount = bigIntToBigDecimal(event.params._amount);
    tx.blockNumber = event.block.number;
    tx.timestamp = event.block.timestamp;

    tx.save();
}
