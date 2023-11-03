import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { BIGINT_ONE, BIGINT_ZERO } from '../constants';

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString('1');
    for (let i = BIGINT_ZERO; i.lt(decimals); i = i.plus(BIGINT_ONE)) {
        bd = bd.times(BigDecimal.fromString('10'));
    }
    return bd;
}
