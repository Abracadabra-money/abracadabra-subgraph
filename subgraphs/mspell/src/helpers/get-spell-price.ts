import { SPELL_ORACLE_ADDRESS } from '../constants';
import { Oracle } from '../../generated/MSpell/Oracle';
import { Address, BigDecimal, Bytes } from '@graphprotocol/graph-ts';
import { BIGDECIMAL_ONE, BIGDECIMAL_ZERO, convertEthToDecimal } from 'misc';

export function getSpellPrice(): BigDecimal {
    if (!SPELL_ORACLE_ADDRESS) return BIGDECIMAL_ZERO;
    const contract = Oracle.bind(Address.fromString(SPELL_ORACLE_ADDRESS));
    const peekCall = contract.try_peekSpot(Bytes.empty());
    if (peekCall.reverted) return BIGDECIMAL_ZERO;
    return BIGDECIMAL_ONE.div(convertEthToDecimal(peekCall.value));
}
