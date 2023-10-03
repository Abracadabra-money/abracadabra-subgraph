import { Address, BigInt, Bytes, dataSource, ethereum, log } from '@graphprotocol/graph-ts';
import { Cauldron as CauldronSchema } from '../../../generated/schema';
import { Cauldron } from '../../../generated/templates';
import { Cauldron as CauldronTemplate } from '../../../generated/templates/Cauldron/Cauldron';
import { BIGDECIMAL_ZERO, BIGINT_ZERO, CAULDRON_V1_BORROW_PARAMETERS, CauldronBorrowParameters } from '../../constants';
import { getOrCreateCollateral } from '../get-or-create-collateral';
import { getOrCreateProtocol } from '../protocol';

export function createCauldron(cauldronAddress: Address, masterContract: Address, blockNumber: BigInt, blockTimestamp: BigInt, data: Bytes): void {
    const CauldronContract = CauldronTemplate.bind(cauldronAddress);

    const masterContractChainAddress = `${dataSource.network()}:${masterContract.toHexString()}`.toLowerCase();

    let cauldronDefinition: CauldronDefinition | null = null;
    if (CAULDRON_V1_BORROW_PARAMETERS.has(masterContractChainAddress)) {
        cauldronDefinition = CauldronDefinition.fromParameters(decodeCauldronInitV1(data), CAULDRON_V1_BORROW_PARAMETERS.get(masterContractChainAddress));
    } else if (!CauldronContract.try_BORROW_OPENING_FEE().reverted) {
        cauldronDefinition = decodeCauldronInitV2Plus(data);
    } else {
        log.warning('[createCauldron] Unable to create cauldron: {}', [cauldronAddress.toHexString()]);
        return;
    }

    const CauldronEntity = new CauldronSchema(cauldronAddress.toHexString());
    const protocol = getOrCreateProtocol();

    const collateral = getOrCreateCollateral(cauldronDefinition.collateral);
    CauldronEntity.masterContract = masterContract;
    CauldronEntity.collateral = collateral.id;
    CauldronEntity.name = collateral.symbol;
    CauldronEntity.createdTimestamp = blockTimestamp;
    CauldronEntity.createdBlockNumber = blockNumber;
    CauldronEntity.collateralPriceUsd = collateral.lastPriceUsd;
    CauldronEntity.exchangeRate = BIGINT_ZERO;
    CauldronEntity.protocol = protocol.id;
    CauldronEntity.isActive = false;
    CauldronEntity.deprecated = false;
    CauldronEntity.lastActive = blockTimestamp;
    CauldronEntity.totalFeesGenerated = BIGDECIMAL_ZERO;
    CauldronEntity.borrowOpeningFee = cauldronDefinition.borrowOpeningFee;
    CauldronEntity.collaterizationRate = cauldronDefinition.collaterizationRate;
    CauldronEntity.interestPerSecond = cauldronDefinition.interestPerSecond;
    CauldronEntity.liquidationMultiplier = cauldronDefinition.liquidationMultiplier;
    CauldronEntity.oracle = cauldronDefinition.oracle;
    CauldronEntity.cumulativeUniqueUsers = 0;
    CauldronEntity.oracleData = CauldronContract.oracleData().toHexString();
    CauldronEntity.liquidationCount = 0;
    CauldronEntity.liquidationAmountUsd = BIGDECIMAL_ZERO;
    CauldronEntity.repaidAmount = BIGDECIMAL_ZERO;
    CauldronEntity.totalMimBorrowed = BIGDECIMAL_ZERO;
    CauldronEntity.totalValueLockedUsd = BIGDECIMAL_ZERO;

    CauldronEntity.save();

    Cauldron.create(cauldronAddress);

    protocol.totalCauldronCount += 1;

    const cauldronIds = protocol.cauldronIds;
    cauldronIds.push(cauldronAddress.toHexString());
    protocol.cauldronIds = cauldronIds;

    protocol.save();
}

class CauldronCollateralParameters {
    constructor(public readonly collateral: Address, public readonly oracle: Address) {}
}

class CauldronDefinition {
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

function decodeCauldronInitV1(data: Bytes): CauldronCollateralParameters {
    const decoded = ethereum.decode('(address,address, bytes)', data)!.toTuple();
    return new CauldronCollateralParameters(decoded[0].toAddress(), decoded[1].toAddress());
}

function decodeCauldronInitV2Plus(data: Bytes): CauldronDefinition {
    const decoded = ethereum.decode('(address,address, bytes, uint64, uint256, uint256, uint256)', data)!.toTuple();
    return new CauldronDefinition(decoded[0].toAddress(), decoded[1].toAddress(), decoded[3].toBigInt(), decoded[4].toBigInt(), decoded[5].toBigInt(), decoded[6].toBigInt());
}
