import { ReceiveFromChain } from '../../generated/Beam/LzIndirectOFTV2';
import { BeamReceiveTx } from '../../generated/schema';
import { getOrCreateBeam } from './get-or-create-beam';
import { bigIntToBigDecimal } from 'misc';

export function createBeamReceiveTx(event: ReceiveFromChain): void {
    const beam = getOrCreateBeam();

    const tx = new BeamReceiveTx(event.transaction.hash.toHexString());
    tx.beam = beam.id;
    tx.srcChainId = event.params._srcChainId;
    tx.to = event.params._to.toHexString();
    tx.amount = bigIntToBigDecimal(event.params._amount);
    tx.blockNumber = event.block.number;
    tx.timestamp = event.block.timestamp;

    tx.save();
}
