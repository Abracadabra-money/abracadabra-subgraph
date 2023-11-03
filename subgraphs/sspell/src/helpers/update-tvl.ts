import { getSpellPrice } from './get-spell-price';
import { ERC20 } from '../../generated/SSpell/ERC20';
import { SPELL_ADDRESS, SSPELL_ADDRESS } from '../constants';
import { Address, ethereum } from '@graphprotocol/graph-ts';
import { bigIntToBigDecimal } from 'misc';
import { getOrCreateSspell } from './get-or-create-sspell';
import { getOrCreateSspellDailySnapshot } from './get-or-create-sspell-daily-snapshot';
import { getOrCreateSspellHourySnapshot } from './get-or-create-sspell-houry-snapshot';

export function updateTvl(block: ethereum.Block): void{
    const contract = ERC20.bind(Address.fromString(SPELL_ADDRESS));
    const spellBalance = contract.balanceOf(Address.fromString(SSPELL_ADDRESS));
    const spellPrice = getSpellPrice();
    const tvl = bigIntToBigDecimal(spellBalance);
    const tvlUsd = tvl.times(spellPrice);


    const sspell = getOrCreateSspell();
    sspell.totalValueLocked = tvl;
    sspell.totalValueLockedUsd = tvlUsd;
    sspell.save();

    const dailySnapshot = getOrCreateSspellDailySnapshot(block);
    dailySnapshot.totalValueLocked = tvl;
    dailySnapshot.totalValueLockedUsd = tvlUsd;
    dailySnapshot.save();

    const hourySnapshot = getOrCreateSspellHourySnapshot(block);
    hourySnapshot.totalValueLocked = tvl;
    hourySnapshot.totalValueLockedUsd = tvlUsd;
    hourySnapshot.save();
}