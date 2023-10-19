import { Address, Bytes, ethereum, BigInt } from '@graphprotocol/graph-ts';
import { CauldronBorrowParameters } from '../constants';

export class CauldronCollateralParameters {
    constructor(public readonly collateral: Address, public readonly oracle: Address) {}
}

export class CauldronDefinition {
    constructor(
        public readonly collateral: Address,
        public readonly oracle: Address,
        public readonly interestPerSecond: BigInt,
        public readonly liquidationMultiplier: BigInt,
        public readonly collaterizationRate: BigInt,
        public readonly borrowOpeningFee: BigInt,
    ) {}

    static fromParameters(collateralParamters: CauldronCollateralParameters, borrowParameters: CauldronBorrowParameters): CauldronDefinition {
        return new CauldronDefinition(
            collateralParamters.collateral,
            collateralParamters.oracle,
            borrowParameters.interestPerSecond,
            borrowParameters.liquidationMultiplier,
            borrowParameters.collaterizationRate,
            borrowParameters.borrowOpeningFee,
        );
    }
}

export function decodeCauldronInitV1(data: Bytes): CauldronCollateralParameters {
    const decoded = ethereum.decode('(address,address, bytes)', data)!.toTuple();
    return new CauldronCollateralParameters(decoded[0].toAddress(), decoded[1].toAddress());
}

export function decodeCauldronInitV2Plus(data: Bytes): CauldronDefinition {
    const decoded = ethereum.decode('(address,address, bytes, uint64, uint256, uint256, uint256)', data)!.toTuple();
    return new CauldronDefinition(decoded[0].toAddress(), decoded[1].toAddress(), decoded[3].toBigInt(), decoded[4].toBigInt(), decoded[5].toBigInt(), decoded[6].toBigInt());
}
