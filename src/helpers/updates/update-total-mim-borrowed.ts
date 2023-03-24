import { Address, ethereum, log } from '@graphprotocol/graph-ts';
import { getOrCreateProtocol } from '../protocol';
import { getOrCreateFinanceialProtocolMetricsDailySnapshot } from '../protocol/get-or-create-financeial-protocol-metrics-daily-snapshot';
import { getOrCreateFinanceialCauldronMetricsDailySnapshot } from '../cauldron/get-or-create-financeial-cauldron-metrics-daily-snapshot';
import { BIGDECIMAL_ZERO } from '../../constants';
import { getCauldron } from '../cauldron';
import { bigIntToBigDecimal, isDeprecated } from '../../utils';
import { Cauldron } from '../../../generated/templates/Cauldron/Cauldron';

export function updateTotalMimBorrowed(block: ethereum.Block): void {
    const protocol = getOrCreateProtocol();

    const protocolDailySnapshot = getOrCreateFinanceialProtocolMetricsDailySnapshot(block);
    let totalMimBorrowed = BIGDECIMAL_ZERO;

    for (let i = 0; i < protocol.cauldronIds.length; i++) {
        const cauldronId = protocol.cauldronIds[i];
        const cauldron = getCauldron(cauldronId);
        if (!cauldron) {
            continue;
        }

        if (isDeprecated(cauldron, block)) {
            cauldron.deprecated = true;
            cauldron.save();
        }

        const contract = Cauldron.bind(Address.fromString(cauldron.id));

        const totalBorrowCall = contract.try_totalBorrow();

        if (totalBorrowCall.reverted) {
            log.warning('[updateTotalMimBorrowed] totalBorrowCall faild {}', [cauldron.id]);
            continue;
        }

        const mimBorrowed = bigIntToBigDecimal(totalBorrowCall.value.getElastic());
        totalMimBorrowed = totalMimBorrowed.plus(mimBorrowed);

        const cauldronDailySnapshot = getOrCreateFinanceialCauldronMetricsDailySnapshot(cauldron, block);
        cauldronDailySnapshot.totalMimBorrowed = mimBorrowed;
        cauldronDailySnapshot.save();

        cauldron.totalMimBorrowed = mimBorrowed;
        cauldron.save();
    }

    protocolDailySnapshot.totalMimBorrowed = totalMimBorrowed;
    protocolDailySnapshot.blockNumber = block.number;
    protocolDailySnapshot.timestamp = block.timestamp;
    protocolDailySnapshot.save();

    protocol.totalMimBorrowed = totalMimBorrowed;
    protocol.save();
}
