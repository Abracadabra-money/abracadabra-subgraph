import { Account, Cauldron } from '../../../generated/schema';
import { getOrCreateProtocol, getOrCreateUsageProtocolMetricsDailySnapshot } from '../protocol';
import { getOrCreateUsageCauldronMetricsDailySnapshot } from '../cauldron/get-or-create-usage-cauldron-metrics-daily-snapshot';
import { ethereum } from '@graphprotocol/graph-ts';

export function getOrCreateAccount(address: string, cauldron: Cauldron, block: ethereum.Block): Account {
    let account = Account.load(address);
    if (!account) {
        account = new Account(address);
        account.save();

        const protocol = getOrCreateProtocol();
        protocol.cumulativeUniqueUsers += 1;
        protocol.save();

        const protocolDailySnapshot = getOrCreateUsageProtocolMetricsDailySnapshot(block);
        protocolDailySnapshot.cumulativeUniqueUsers += 1;
        protocolDailySnapshot.save();

        const cauldronDailySnapshot = getOrCreateUsageCauldronMetricsDailySnapshot(cauldron, block);
        cauldronDailySnapshot.cumulativeUniqueUsers += 1;
        cauldronDailySnapshot.save();
    }
    return account;
}
