import { ethereum } from '@graphprotocol/graph-ts';
import { getOrCreateProtocol } from '../protocol';
import { getOrCreateProtocolDailySnapshot, getOrCreateProtocolHourySnapshot } from '../protocol';
import { getOrCreateCauldronDailySnapshot, getOrCreateCauldronHourySnapshot } from '../cauldron';
import { BIGDECIMAL_ZERO } from 'misc';
import { getCauldron } from '../cauldron';
import { isDeprecated } from '../../utils';

export function updateTvl(block: ethereum.Block): void {
    const protocol = getOrCreateProtocol();

    const protocolDailySnapshot = getOrCreateProtocolDailySnapshot(block);
    const protocolHourySnapshot = getOrCreateProtocolHourySnapshot(block);

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

        const marketTVL = cauldron.totalCollateralShare.times(cauldron.collateralPriceUsd);
        totalValueLockedUsd = totalValueLockedUsd.plus(marketTVL);

        const cauldronDailySnapshot = getOrCreateCauldronDailySnapshot(cauldron, block);
        cauldronDailySnapshot.totalValueLockedUsd = marketTVL;
        cauldronDailySnapshot.save();

        const cauldronHourySnapshot = getOrCreateCauldronHourySnapshot(cauldron, block);
        cauldronHourySnapshot.totalValueLockedUsd = marketTVL;
        cauldronHourySnapshot.save();

        cauldron.totalValueLockedUsd = marketTVL;
        cauldron.save();
    }

    protocolDailySnapshot.totalValueLockedUsd = totalValueLockedUsd;
    protocolDailySnapshot.save();

    protocolHourySnapshot.totalValueLockedUsd = totalValueLockedUsd;
    protocolHourySnapshot.save();

    protocol.totalValueLockedUsd = totalValueLockedUsd;
    protocol.save();
}
