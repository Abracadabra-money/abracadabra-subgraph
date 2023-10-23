import { Account, Cauldron } from '../../../generated/schema';
import { getOrCreateProtocol, getOrCreateProtocolDailySnapshot, getOrCreateProtocolHourySnapshot } from '../protocol';
import { getOrCreateCauldronDailySnapshot, getOrCreateCauldronHourySnapshot } from '../cauldron';
import { ethereum } from '@graphprotocol/graph-ts';
import { BIGINT_ZERO, BIGINT_ONE } from 'misc';

export function getOrCreateAccount(cauldron: Cauldron, accountId: string, block: ethereum.Block): Account {
    let account = Account.load(accountId);
    if (!account) {
        account = new Account(accountId);
        account.liquidationCount = BIGINT_ZERO;
        account.save();

        const cauldronDailySnapshot = getOrCreateCauldronDailySnapshot(cauldron, block);
        cauldronDailySnapshot.cumulativeUniqueUsers = cauldronDailySnapshot.cumulativeUniqueUsers.plus(BIGINT_ONE);
        cauldronDailySnapshot.save();

        const cauldronHourySnapshot = getOrCreateCauldronHourySnapshot(cauldron, block);
        cauldronHourySnapshot.cumulativeUniqueUsers = cauldronHourySnapshot.cumulativeUniqueUsers.plus(BIGINT_ONE);
        cauldronHourySnapshot.save();

        cauldron.cumulativeUniqueUsers = cauldron.cumulativeUniqueUsers.plus(BIGINT_ONE);
        cauldron.save();

        const protocol = getOrCreateProtocol();
        protocol.cumulativeUniqueUsers = protocol.cumulativeUniqueUsers.plus(BIGINT_ONE);
        protocol.save();

        const protocolDailySnapshot = getOrCreateProtocolDailySnapshot(block);
        protocolDailySnapshot.cumulativeUniqueUsers = protocolDailySnapshot.cumulativeUniqueUsers.plus(BIGINT_ONE);
        protocolDailySnapshot.save();

        const protocolHourySnapshot = getOrCreateProtocolHourySnapshot(block);
        protocolHourySnapshot.cumulativeUniqueUsers = protocolHourySnapshot.cumulativeUniqueUsers.plus(BIGINT_ONE);
        protocolHourySnapshot.save();
    }
    return account;
}
