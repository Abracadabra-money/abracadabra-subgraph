import { SPELL_ORACLE_ADDRESS } from '../constants';
import { Oracle } from '../../generated/MSpell/Oracle';
import { Address, BigDecimal } from '@graphprotocol/graph-ts';
import { BIGDECIMAL_ZERO, bigIntToBigDecimal } from 'misc';

export function getSpellPrice(): BigDecimal {
    if (!SPELL_ORACLE_ADDRESS) return BIGDECIMAL_ZERO;
    const contract = Oracle.bind(Address.fromString(SPELL_ORACLE_ADDRESS));
    const peekCall = contract.try_latestAnswer();
    if (peekCall.reverted) return BIGDECIMAL_ZERO;
    return bigIntToBigDecimal(peekCall.value, 8);
}
