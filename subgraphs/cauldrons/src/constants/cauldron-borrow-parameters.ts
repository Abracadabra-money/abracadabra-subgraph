import { BigInt } from '@graphprotocol/graph-ts';

export class CauldronBorrowParameters {
    constructor(
        public readonly interestPerSecond: BigInt,
        public readonly liquidationMultiplier: BigInt,
        public readonly collaterizationRate: BigInt,
        public readonly borrowOpeningFee: BigInt,
    ) {}
}

export const CAULDRON_V1_BORROW_PARAMETERS = new Map<string, CauldronBorrowParameters>()
    .set(
        'mainnet:0x469a991a6bB8cbBfEe42E7aB846eDEef1bc0B3d3'.toLowerCase(),
        new CauldronBorrowParameters(BigInt.fromI32(253509908), BigInt.fromI32(103000), BigInt.fromI32(90000), BigInt.fromI32(50)),
    )
    .set(
        'mainnet:0x4a9Cb5D0B755275Fd188f87c0A8DF531B0C7c7D2'.toLowerCase(),
        new CauldronBorrowParameters(BigInt.fromI32(475331078), BigInt.fromI32(112500), BigInt.fromI32(75000), BigInt.fromI32(50)),
    );
