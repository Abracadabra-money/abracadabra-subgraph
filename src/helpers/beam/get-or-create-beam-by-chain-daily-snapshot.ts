import { dataSource, ethereum } from '@graphprotocol/graph-ts';
import { getOrCreateBeamByChain } from '.';
import { BeamByChainDailySnapshot } from '../../../generated/schema';
import { BEAM_OFT, BIGINT_ZERO, SECONDS_PER_DAY } from '../../constants';

export function getOrCreateBeamByChainDailySnapshot(chainId: number, block: ethereum.Block): BeamByChainDailySnapshot {
    const epochDay: i64 = block.timestamp.toI64() / SECONDS_PER_DAY;
    const id = `${BEAM_OFT.get(dataSource.network()).toHexString()}-${chainId}-${epochDay}`;

    let beamByChainDailySnapshot = BeamByChainDailySnapshot.load(id);
    if (beamByChainDailySnapshot) return beamByChainDailySnapshot;

    const beamByChain = getOrCreateBeamByChain(chainId);

    beamByChainDailySnapshot = new BeamByChainDailySnapshot(id);
    beamByChainDailySnapshot.beamByChain = beamByChain.id;
    beamByChainDailySnapshot.timestamp = block.timestamp;
    beamByChainDailySnapshot.txCount = BIGINT_ZERO;
    beamByChainDailySnapshot.txVolume = BIGINT_ZERO;
    beamByChainDailySnapshot.rxCount = BIGINT_ZERO;
    beamByChainDailySnapshot.rxVolume = BIGINT_ZERO;
    beamByChainDailySnapshot.save();

    return beamByChainDailySnapshot;
}
