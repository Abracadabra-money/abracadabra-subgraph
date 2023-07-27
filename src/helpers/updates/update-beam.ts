import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { BIGINT_ONE } from '../../constants';
import {
    getOrCreateBeam,
    getOrCreateBeamByChain,
    getOrCreateBeamByChainDailySnapshot,
    getOrCreateBeamBySource,
    getOrCreateBeamBySourceDailySnapshot,
    getOrCreateBeamDailySnapshot,
} from '../beam';

export function updateBeamTx(chainId: number, amount: BigInt, source: Address | null, block: ethereum.Block): void {
    // Group unknown sources as null address
    const sourceOrZero = source !== null ? source : Address.zero();

    const beam = getOrCreateBeam();
    const beamDailySnapshot = getOrCreateBeamDailySnapshot(block);
    const beamBySource = getOrCreateBeamBySource(sourceOrZero);
    const beamBySourceDailySnapshot = getOrCreateBeamBySourceDailySnapshot(sourceOrZero, block);
    const beamByChain = getOrCreateBeamByChain(chainId);
    const beamByChainDailySnapshot = getOrCreateBeamByChainDailySnapshot(chainId, block);

    beam.txCount = beam.txCount.plus(BIGINT_ONE);
    beamDailySnapshot.txCount = beamDailySnapshot.txCount.plus(BIGINT_ONE);
    beamBySource.txCount = beamBySource.txCount.plus(BIGINT_ONE);
    beamBySourceDailySnapshot.txCount = beamBySourceDailySnapshot.txCount.plus(BIGINT_ONE);
    beamByChain.txCount = beamByChain.txCount.plus(BIGINT_ONE);
    beamByChainDailySnapshot.txCount = beamByChainDailySnapshot.txCount.plus(BIGINT_ONE);

    beam.txVolume = beam.txVolume.plus(amount);
    beamDailySnapshot.txVolume = beamDailySnapshot.txVolume.plus(amount);
    beamBySource.txVolume = beamBySource.txVolume.plus(amount);
    beamBySourceDailySnapshot.txVolume = beamBySourceDailySnapshot.txVolume.plus(amount);
    beamByChain.txVolume = beamByChain.txVolume.plus(amount);
    beamByChainDailySnapshot.txVolume = beamByChainDailySnapshot.txVolume.plus(amount);

    beam.save();
    beamDailySnapshot.save();
    beamBySource.save();
    beamBySourceDailySnapshot.save();
    beamByChain.save();
    beamByChainDailySnapshot.save();
}

export function updateBeamRx(chainId: number, amount: BigInt, block: ethereum.Block): void {
    const beam = getOrCreateBeam();
    const beamDailySnapshot = getOrCreateBeamDailySnapshot(block);
    const beamByChain = getOrCreateBeamByChain(chainId);
    const beamByChainDailySnapshot = getOrCreateBeamByChainDailySnapshot(chainId, block);

    beam.rxCount = beam.rxCount.plus(BIGINT_ONE);
    beamDailySnapshot.rxCount = beamDailySnapshot.rxCount.plus(BIGINT_ONE);
    beamByChain.rxCount = beamByChain.rxCount.plus(BIGINT_ONE);
    beamByChainDailySnapshot.rxCount = beamByChainDailySnapshot.rxCount.plus(BIGINT_ONE);

    beam.rxVolume = beam.rxVolume.plus(amount);
    beamDailySnapshot.rxVolume = beamDailySnapshot.rxVolume.plus(amount);
    beamByChain.rxVolume = beamByChain.rxVolume.plus(amount);
    beamByChainDailySnapshot.rxVolume = beamByChainDailySnapshot.rxVolume.plus(amount);

    beam.save();
    beamDailySnapshot.save();
    beamByChain.save();
    beamByChainDailySnapshot.save();
}
