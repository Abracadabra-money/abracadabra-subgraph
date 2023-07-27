import { ReceiveFromChain, SendFromCall, SendToChain } from '../../generated/Beam/LzBaseOFTV2';
import { updateBeamRx, updateBeamTx } from '../helpers/updates';

export function handleSendToChain(event: SendToChain): void {
    updateBeamTx(event.params._dstChainId, event.params._amount, event.transaction.to, event.block);
}

export function handleReceiveFromChain(event: ReceiveFromChain): void {
    updateBeamRx(event.params._srcChainId, event.params._amount, event.block);
}

export function handleSendFromCall(call: SendFromCall): void {
    // Consider the source as the contract itself if the callee and the transaction
    // from is equals i.e. msg.sender == msg.origin
    const source = call.from == call.transaction.from ? call.to : call.from;
    updateBeamTx(call.inputs._dstChainId, call.inputs._amount, source, call.block);
}
