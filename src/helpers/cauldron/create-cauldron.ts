import { BigInt, Address, Bytes, ethereum, log } from '@graphprotocol/graph-ts';
import { Cauldron as CauldronSchema } from '../../../generated/schema';
import { BIGINT_ZERO, BIGDECIMAL_ZERO } from '../../constants';
import { getOrCreateCollateral } from '../get-or-create-collateral';
import { getOrCreateProtocol } from '../protocol';
import { Cauldron as CauldronTemplate } from '../../../generated/templates/Cauldron/Cauldron';
import { Cauldron } from '../../../generated/templates';

export function createCauldron(cauldronAddress: Address, blockNumber: BigInt, blockTimestamp: BigInt, data: Bytes): void {
    const CauldronContract = CauldronTemplate.bind(cauldronAddress);
    const borrowOpeningFeeCall = CauldronContract.try_BORROW_OPENING_FEE();
    if (borrowOpeningFeeCall.reverted) return;

    const decoded = ethereum.decode('(address,address, bytes, uint64, uint256, uint256, uint256)', data)!.toTuple();

    const CauldronEntity = new CauldronSchema(cauldronAddress.toHexString());
    const protocol = getOrCreateProtocol();

    const collateral = getOrCreateCollateral(decoded[0].toAddress());
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
    CauldronEntity.borrowOpeningFee = decoded[6].toBigInt();
    CauldronEntity.collaterizationRate = decoded[5].toBigInt();
    CauldronEntity.interestPerSecond = decoded[3].toBigInt();
    CauldronEntity.liquidationMultiplier = decoded[4].toBigInt();
    CauldronEntity.oracle = decoded[1].toAddress();
    CauldronEntity.cumulativeUniqueUsers = 0;
    CauldronEntity.oracleData = CauldronContract.oracleData().toHexString();

    CauldronEntity.save();

    Cauldron.create(cauldronAddress);

    protocol.totalCauldronCount += 1;

    const cauldronIds = protocol.cauldronIds;
    cauldronIds.push(cauldronAddress.toHexString());
    protocol.cauldronIds = cauldronIds;

    protocol.save();
}
