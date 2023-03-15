import { Address, ethereum, log } from '@graphprotocol/graph-ts';
import { getOrCreateProtocol } from '../protocol';
import { getOrCreateFinanceialProtocolMetricsDailySnapshot } from '../protocol/get-or-create-financeial-protocol-metrics-daily-snapshot';
import { getOrCreateFinanceialCauldronMetricsDailySnapshot } from '../cauldron/get-or-create-financeial-cauldron-metrics-daily-snapshot';
import { BIGDECIMAL_ZERO } from '../../constants';
import { getCauldron } from '../cauldron';
import { bigIntToBigDecimal, isDeprecated } from '../../utils';
import { Cauldron } from '../../../generated/templates/Cauldron/Cauldron';

export function updateTvl(block: ethereum.Block): void {
    const protocol = getOrCreateProtocol();

    const protocolDailySnapshot = getOrCreateFinanceialProtocolMetricsDailySnapshot(block);
    let totalValueLockedUsd = BIGDECIMAL_ZERO;

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

        const totalCollateralShareCall = contract.try_totalCollateralShare();

        if (totalCollateralShareCall.reverted) {
            log.warning('[updateTvl] totalCollateralShareCall faild {}', [cauldron.id]);
            continue;
        }

        const marketTVL = bigIntToBigDecimal(totalCollateralShareCall.value).times(cauldron.collateralPriceUsd);
        totalValueLockedUsd = totalValueLockedUsd.plus(marketTVL);

        const cauldronDailySnapshot = getOrCreateFinanceialCauldronMetricsDailySnapshot(cauldron, block);
        cauldronDailySnapshot.totalValueLockedUsd = marketTVL;
        cauldronDailySnapshot.save();
    }

    protocolDailySnapshot.totalValueLockedUsd = totalValueLockedUsd;
    protocolDailySnapshot.blockNumber = block.number;
    protocolDailySnapshot.timestamp = block.timestamp;
    protocolDailySnapshot.save();

    protocol.totalValueLockedUsd = totalValueLockedUsd;
    protocol.save();
}
