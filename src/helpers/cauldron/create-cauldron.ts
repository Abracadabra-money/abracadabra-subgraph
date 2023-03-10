import { BigInt, Address } from '@graphprotocol/graph-ts';
import { Cauldron as CauldronSchema } from '../../../generated/schema';
import { Cauldron as CauldronTemplate } from '../../../generated/templates/Cauldron/Cauldron';
import { BIGINT_ZERO, BIGDECIMAL_ZERO } from '../../constants';
import { getOrCreateCollateral } from '../get-or-create-collateral';
import { getOrCreateProtocol } from '../get-or-create-protocol';

export function createCauldron(cauldronAddress: Address, blockNumber: BigInt, blockTimestamp: BigInt): void {
    const CauldronContract = CauldronTemplate.bind(cauldronAddress);

    const collateralCall = CauldronContract.try_collateral();
    const borrowOpeningFeeCall = CauldronContract.try_BORROW_OPENING_FEE();
    const collaterizationRateCall = CauldronContract.try_COLLATERIZATION_RATE();
    const liquidationMultiplierCall = CauldronContract.try_LIQUIDATION_MULTIPLIER();

    if (collateralCall.reverted || !collateralCall.value || borrowOpeningFeeCall.reverted || collaterizationRateCall.reverted || liquidationMultiplierCall.reverted) return;

    const CauldronEntity = new CauldronSchema(cauldronAddress.toHexString());
    const protocol = getOrCreateProtocol();

    const collateral = getOrCreateCollateral(collateralCall.value);
    CauldronEntity.collateral = collateral.id;
    CauldronEntity.name = collateral.symbol;
    CauldronEntity.createdTimestamp = blockTimestamp;
    CauldronEntity.createdBlockNumber = blockNumber;
    CauldronEntity.collateralPriceUsd = collateral.lastPriceUsd!;
    CauldronEntity.exchangeRate = BIGINT_ZERO;
    CauldronEntity.protocol = protocol.id;
    CauldronEntity.isActive = false;
    CauldronEntity.deprecated = false;
    CauldronEntity.lastActive = blockTimestamp;
    CauldronEntity.totalFeesGenerated = BIGDECIMAL_ZERO;
    CauldronEntity.borrowOpeningFee = borrowOpeningFeeCall.value;
    CauldronEntity.collaterizationRate = collaterizationRateCall.value;
    CauldronEntity.interestPerSecond = CauldronContract.accrueInfo().getINTEREST_PER_SECOND();
    CauldronEntity.liquidationMultiplier = liquidationMultiplierCall.value;

    const oracleCall = CauldronContract.try_oracle();
    if (!oracleCall.reverted) {
        CauldronEntity.oracle = oracleCall.value;
    }

    const oracleDataCall = CauldronContract.try_oracleData();
    if (!oracleDataCall.reverted) {
        CauldronEntity.oracleData = oracleDataCall.value.toHexString();
    }

    CauldronEntity.save();

    protocol.totalCauldronCount += 1;

    const cauldronIds = protocol.cauldronIds;
    cauldronIds.push(cauldronAddress.toHexString());
    protocol.cauldronIds = cauldronIds;

    protocol.save();
}
