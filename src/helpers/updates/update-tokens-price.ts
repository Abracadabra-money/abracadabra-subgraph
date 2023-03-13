import { Address, Bytes, ethereum, log } from '@graphprotocol/graph-ts';
import { getOrCreateProtocol } from '../get-or-create-protocol';
import { getCauldron } from '../cauldron/get-cauldron';
import { getOrCreateCollateral } from '../get-or-create-collateral';
import { Oracle } from '../../../generated/templates/Cauldron/Oracle';
import { BIGINT_ZERO } from '../../constants';
import { updateTokenPrice } from './update-token-price';

export function updateTokensPrice(block: ethereum.Block): void {
    const protocol = getOrCreateProtocol();
    for (let i = 0; i < protocol.cauldronIds.length; i++) {
        const cauldron = getCauldron(protocol.cauldronIds[i]);
        if (!cauldron) {
            log.warning('[updateTokensPrice] Cauldron not found: {}', [protocol.cauldronIds[i]]);
            continue;
        }

        if (!cauldron.isActive) {
            continue;
        }

        const collateral = getOrCreateCollateral(Address.fromString(cauldron.collateral));
        if (collateral.lastPriceBlockNumber && collateral.lastPriceBlockNumber!.ge(block.number)) {
            continue;
        }

        if (cauldron.oracle === null) {
            log.warning('[updateTokensPrice] Cauldron {} has no oracle', [cauldron.id]);
            continue;
        }

        const oracle = Oracle.bind(Address.fromBytes(cauldron.oracle!));
        const peekSpotCall = oracle.try_peekSpot(Bytes.fromHexString('0x00'));
        if (peekSpotCall.reverted || peekSpotCall.value == BIGINT_ZERO) {
            log.warning('[updateAllTokenPrices] Cauldron {} oracle peekSpot() failed', [cauldron.id]);
            continue;
        }

        updateTokenPrice(peekSpotCall.value, collateral, cauldron, block);
    }
}
