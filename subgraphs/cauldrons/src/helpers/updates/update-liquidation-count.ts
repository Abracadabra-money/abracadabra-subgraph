import { ethereum } from '@graphprotocol/graph-ts';
import { Account, Cauldron } from '../../../generated/schema';
import { getOrCreateProtocol, getOrCreateProtocolDailySnapshot, getOrCreateProtocolHourySnapshot } from '../protocol';
import { getOrCreateCauldronDailySnapshot, getOrCreateCauldronHourySnapshot } from '../cauldron';
import { BIGINT_ONE } from 'misc';

export function updateLiquidationCount(cauldron: Cauldron, account: Account, block: ethereum.Block): void {
    const protocol = getOrCreateProtocol();
    protocol.liquidationCount = protocol.liquidationCount.plus(BIGINT_ONE);
    protocol.save();

    cauldron.liquidationCount = cauldron.liquidationCount.plus(BIGINT_ONE);
    cauldron.save();

    account.liquidationCount = account.liquidationCount.plus(BIGINT_ONE);
    account.save();

    const protocolDailySnapshot = getOrCreateProtocolDailySnapshot(block);
    protocolDailySnapshot.liquidationCount = protocolDailySnapshot.liquidationCount.plus(BIGINT_ONE);
    protocolDailySnapshot.save();

    const protocolHourySnapshot = getOrCreateProtocolHourySnapshot(block);
    protocolHourySnapshot.liquidationCount = protocolHourySnapshot.liquidationCount.plus(BIGINT_ONE);
    protocolHourySnapshot.save();

    const cauldronDailySnapshot = getOrCreateCauldronDailySnapshot(cauldron, block);
    cauldronDailySnapshot.liquidationCount = cauldronDailySnapshot.liquidationCount.plus(BIGINT_ONE);
    cauldronDailySnapshot.save();

    const cauldronHourySnapshot = getOrCreateCauldronHourySnapshot(cauldron, block);
    cauldronHourySnapshot.liquidationCount = cauldronHourySnapshot.liquidationCount.plus(BIGINT_ONE);
    cauldronHourySnapshot.save();
}
