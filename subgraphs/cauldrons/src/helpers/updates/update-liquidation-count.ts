import { ethereum } from '@graphprotocol/graph-ts';
import { Account, Cauldron } from '../../../generated/schema';
import { getOrCreateProtocol, getOrCreateProtocolDailySnapshot, getOrCreateProtocolHourySnapshot } from '../protocol';
import { getOrCreateCauldronDailySnapshot, getOrCreateCauldronHourySnapshot } from '../cauldron';

export function updateLiquidationCount(cauldron: Cauldron, account: Account, block: ethereum.Block): void {
    const protocol = getOrCreateProtocol();
    protocol.liquidationCount = protocol.liquidationCount + 1;
    protocol.save();

    cauldron.liquidationCount = cauldron.liquidationCount + 1;
    cauldron.save();

    account.liquidationCount = account.liquidationCount + 1;
    account.save();

    const protocolDailySnapshot = getOrCreateProtocolDailySnapshot(block);
    protocolDailySnapshot.liquidationCount = protocolDailySnapshot.liquidationCount + 1;
    protocolDailySnapshot.save();

    const protocolHourySnapshot = getOrCreateProtocolHourySnapshot(block);
    protocolHourySnapshot.liquidationCount = protocolHourySnapshot.liquidationCount + 1;
    protocolHourySnapshot.save();

    const cauldronDailySnapshot = getOrCreateCauldronDailySnapshot(cauldron, block);
    cauldronDailySnapshot.liquidationCount = cauldronDailySnapshot.liquidationCount + 1;
    cauldronDailySnapshot.save();

    const cauldronHourySnapshot = getOrCreateCauldronHourySnapshot(cauldron, block);
    cauldronHourySnapshot.liquidationCount = cauldronHourySnapshot.liquidationCount + 1;
    cauldronHourySnapshot.save();
}
