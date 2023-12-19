import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/templates/Cauldron/Cauldron';
import { ERC20 } from '../../../generated/templates/Cauldron/ERC20';
import { Oracle } from '../../../generated/templates/Cauldron/Oracle';
import { BIGINT_TEN, bigIntToBigDecimal } from 'misc';

export function getUsdAmount(cauldron: Address, amount: BigInt): BigDecimal | null {
    const cauldronContract = Cauldron.bind(cauldron);
    const collateralContract = ERC20.bind(cauldronContract.collateral());
    const collateralDecimals = collateralContract.decimals() as u8;
    const oracle = Oracle.bind(cauldronContract.oracle());
    const peekSpotValue = oracle.try_peekSpot(cauldronContract.oracleData());
    if (peekSpotValue.reverted) {
        return null;
    }
    const usdAmount = amount.times(BIGINT_TEN.pow(collateralDecimals)).div(peekSpotValue.value);
    return bigIntToBigDecimal(usdAmount, collateralDecimals);
}
