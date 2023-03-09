import { ethereum } from '@graphprotocol/graph-ts';
import { Position, PositionSnapshot } from '../../../generated/schema';

export function snapshotPosition(position: Position, event: ethereum.Event): void {
    const snapshot = new PositionSnapshot(position.id.concat('-').concat(event.transaction.hash.toHexString()).concat('-').concat(event.logIndex.toString()));
    snapshot.hash = event.transaction.hash.toHexString();
    snapshot.logIndex = event.logIndex.toI32();
    snapshot.nonce = event.transaction.nonce;
    snapshot.position = position.id;
    snapshot.balance = position.balance;
    snapshot.blockNumber = event.block.number;
    snapshot.timestamp = event.block.timestamp;
    snapshot.save();
}
