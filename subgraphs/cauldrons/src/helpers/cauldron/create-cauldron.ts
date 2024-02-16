import { Address, BigInt, Bytes, dataSource, log } from '@graphprotocol/graph-ts';
import { Cauldron as CauldronSchema } from '../../../generated/schema';
import { Cauldron } from '../../../generated/templates';
import { Cauldron as CauldronTemplate } from '../../../generated/templates/Cauldron/Cauldron';
import { CAULDRON_V1_BORROW_PARAMETERS, DISABLED_CAULDRONS } from '../../constants';
import { getOrCreateCollateral } from '../collateral';
import { getOrCreateProtocol } from '../protocol';
import { BIGDECIMAL_ZERO, BIGINT_ZERO, BIGINT_ONE } from 'misc';
import { CauldronDefinition, decodeCauldronInitV1, decodeCauldronInitV2Plus } from '../../utils';

export function createCauldron(cauldronAddress: Address, masterContract: Address, blockNumber: BigInt, blockTimestamp: BigInt, data: Bytes): void {
    if(DISABLED_CAULDRONS.includes(cauldronAddress.toHexString().toLowerCase())) return;

    const CauldronContract = CauldronTemplate.bind(cauldronAddress);

    const masterContractChainAddress = `${dataSource.network()}:${masterContract.toHexString()}`.toLowerCase();

    let cauldronDefinition: CauldronDefinition | null = null;
    if (CAULDRON_V1_BORROW_PARAMETERS.has(masterContractChainAddress)) {
        cauldronDefinition = CauldronDefinition.fromParameters(decodeCauldronInitV1(data), CAULDRON_V1_BORROW_PARAMETERS.get(masterContractChainAddress)!);
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
    CauldronEntity.borrowFeesGenerated = BIGDECIMAL_ZERO;
    CauldronEntity.interestFeesGenerated = BIGDECIMAL_ZERO;
    CauldronEntity.liquidationFeesGenerated = BIGDECIMAL_ZERO;
    CauldronEntity.borrowOpeningFee = cauldronDefinition.borrowOpeningFee;
    CauldronEntity.collaterizationRate = cauldronDefinition.collaterizationRate;
    CauldronEntity.interestPerSecond = cauldronDefinition.interestPerSecond;
    CauldronEntity.liquidationMultiplier = cauldronDefinition.liquidationMultiplier;
    CauldronEntity.oracle = cauldronDefinition.oracle;
    CauldronEntity.cumulativeUniqueUsers = BIGINT_ZERO;
    CauldronEntity.oracleData = CauldronContract.oracleData().toHexString();
    CauldronEntity.liquidationCount = BIGINT_ZERO;
    CauldronEntity.liquidationAmountUsd = BIGDECIMAL_ZERO;
    CauldronEntity.repaidAmount = BIGDECIMAL_ZERO;
    CauldronEntity.totalMimBorrowed = BIGDECIMAL_ZERO;
    CauldronEntity.totalValueLockedUsd = BIGDECIMAL_ZERO;
    CauldronEntity.totalCollateralShare = BIGDECIMAL_ZERO;
    CauldronEntity.dailySnapshotCount = BIGINT_ZERO;
    CauldronEntity.hourySnapshotCount = BIGINT_ZERO;

    CauldronEntity.save();

    Cauldron.create(cauldronAddress);

    protocol.totalCauldronCount = protocol.totalCauldronCount.plus(BIGINT_ONE);

    const cauldronIds = protocol.cauldronIds;
    cauldronIds.push(cauldronAddress.toHexString());
    protocol.cauldronIds = cauldronIds;

    protocol.save();
}
