import { Address, Entity, ethereum } from '@graphprotocol/graph-ts';

export function fillEvent(contractEvent: ethereum.Event, account: Address, entityEvent: Entity): void {
    const cauldronAddress = contractEvent.address.toHexString();

    entityEvent.setBigInt('blockNumber', contractEvent.block.number);
    entityEvent.setBytes('transactionHash', contractEvent.transaction.hash);
    entityEvent.setBigInt('logIndex', contractEvent.logIndex);
    entityEvent.setBigInt('timestamp', contractEvent.block.timestamp);
    entityEvent.setString('cauldron', cauldronAddress);
    entityEvent.setString('account', account.toHexString());
    entityEvent.setString('accountState', `${cauldronAddress}-${account.toHexString()}`);
}
