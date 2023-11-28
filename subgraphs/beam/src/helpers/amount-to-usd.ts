import { BigDecimal } from '@graphprotocol/graph-ts';
import { ORACLE_ADDRESS } from '../constants';
import { Oracle } from '../../generated/Wrapper/Oracle';
import { BIGDECIMAL_ZERO, bigIntToBigDecimal } from 'misc';
import { Address } from '@graphprotocol/graph-ts';

export function amountToUsd(amount: BigDecimal): BigDecimal {
    if (ORACLE_ADDRESS.length === 0) return BIGDECIMAL_ZERO;

    const oracle = Oracle.bind(Address.fromString(ORACLE_ADDRESS));
    const call = oracle.try_latestAnswer();

    if (call.reverted) return BIGDECIMAL_ZERO;
    const price = bigIntToBigDecimal(call.value, 8);
    return amount.times(price);
}
