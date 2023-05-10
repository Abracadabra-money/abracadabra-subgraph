import { Account, Cauldron } from '../../../generated/schema';
import { getOrCreateProtocol, getOrCreateUsageProtocolMetricsDailySnapshot } from '../protocol';
import { getOrCreateUsageCauldronMetricsDailySnapshot } from '../cauldron';
import { ethereum } from '@graphprotocol/graph-ts';

export function getOrCreateAccount(cauldron: Cauldron, accountId: string, block: ethereum.Block): Account {
    let account = Account.load(accountId);
    if (!account) {
        account = new Account(accountId);
        account.liquidationCount = 0;
        account.save();

        const cauldronDailySnapshot = getOrCreateUsageCauldronMetricsDailySnapshot(cauldron, block);
        cauldronDailySnapshot.cumulativeUniqueUsers += 1;
        cauldronDailySnapshot.save();

        cauldron.cumulativeUniqueUsers += 1;
        cauldron.save();

        const protocol = getOrCreateProtocol();
        protocol.cumulativeUniqueUsers += 1;
        protocol.save();

        const protocolDailySnapshot = getOrCreateUsageProtocolMetricsDailySnapshot(block);
        protocolDailySnapshot.cumulativeUniqueUsers += 1;
        protocolDailySnapshot.save();
    }
    return account;
}
