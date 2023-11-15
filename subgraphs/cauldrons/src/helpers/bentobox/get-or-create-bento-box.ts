import { Address } from '@graphprotocol/graph-ts';
import { BentoBox, Protocol } from '../../../generated/schema';

export function getOrCreateBentoBox(address: Address, protocol: Protocol): BentoBox {
    const id = address.toHexString();
    let bentoBox = BentoBox.load(id);
    if (bentoBox == null) {
        bentoBox = new BentoBox(id);
        bentoBox.protocol = protocol.id;
        bentoBox.save();
    }
    return bentoBox;
}
