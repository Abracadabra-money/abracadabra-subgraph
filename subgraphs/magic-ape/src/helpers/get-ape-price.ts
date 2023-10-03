import { Address, BigDecimal, Bytes } from '@graphprotocol/graph-ts';
import { APE_ORACLE_ADDRESS } from '../constants';
import { Oracle } from '../../generated/MagicApe/Oracle';
import { bigIntToBigDecimal, BIGDECIMAL_ONE } from 'misc';

export function getApePrice(): BigDecimal {
    const oracle = Oracle.bind(Address.fromString(APE_ORACLE_ADDRESS));
    const rate = oracle.peekSpot(Bytes.fromHexString('0x'));
    return BIGDECIMAL_ONE.div(bigIntToBigDecimal(rate));
}
