import { Account, Cauldron } from '../../../generated/schema';
import { getOrCreateProtocol, getOrCreateProtocolDailySnapshot, getOrCreateProtocolHourySnapshot } from '../protocol';
import { getOrCreateCauldronDailySnapshot, getOrCreateCauldronHourySnapshot } from '../cauldron';
import { ethereum } from '@graphprotocol/graph-ts';

export function getOrCreateAccount(cauldron: Cauldron, accountId: string, block: ethereum.Block): Account {
    let account = Account.load(accountId);
    if (!account) {
        account = new Account(accountId);
        account.liquidationCount = 0;
        account.save();

        const cauldronDailySnapshot = getOrCreateCauldronDailySnapshot(cauldron, block);
        cauldronDailySnapshot.cumulativeUniqueUsers = cauldronDailySnapshot.cumulativeUniqueUsers + 1;
        cauldronDailySnapshot.save();

        const cauldronHourySnapshot = getOrCreateCauldronHourySnapshot(cauldron, block);
        cauldronHourySnapshot.cumulativeUniqueUsers = cauldronHourySnapshot.cumulativeUniqueUsers + 1;
        cauldronHourySnapshot.save();

        cauldron.cumulativeUniqueUsers = cauldron.cumulativeUniqueUsers + 1;
        cauldron.save();

        const protocol = getOrCreateProtocol();
        protocol.cumulativeUniqueUsers = protocol.cumulativeUniqueUsers + 1;
        protocol.save();

        const protocolDailySnapshot = getOrCreateProtocolDailySnapshot(block);
        protocolDailySnapshot.cumulativeUniqueUsers = protocolDailySnapshot.cumulativeUniqueUsers + 1;
        protocolDailySnapshot.save();

        const protocolHourySnapshot = getOrCreateProtocolHourySnapshot(block);
        protocolHourySnapshot.cumulativeUniqueUsers = protocolHourySnapshot.cumulativeUniqueUsers + 1;
        protocolHourySnapshot.save();
    }
    return account;
}
