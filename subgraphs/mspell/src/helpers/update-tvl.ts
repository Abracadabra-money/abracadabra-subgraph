import { getSpellPrice } from './get-spell-price';
import { ERC20 } from '../../generated/MSpell/ERC20';
import { SPELL_ADDRESS, MSPELL_ADDRESS } from '../constants';
import { Address, ethereum } from '@graphprotocol/graph-ts';
import { bigIntToBigDecimal } from 'misc';
import { getOrCreateMspell } from './get-or-create-mspell';
import { getOrCreateMspellDailySnapshot } from './get-or-create-mspell-daily-snapshot';
import { getOrCreateMspellHourySnapshot } from './get-or-create-mspell-houry-snapshot';

export function updateTvl(block: ethereum.Block): void{
    const contract = ERC20.bind(Address.fromString(SPELL_ADDRESS));
    const spellBalance = contract.balanceOf(Address.fromString(MSPELL_ADDRESS));
    const spellPrice = getSpellPrice();
    const tvl = bigIntToBigDecimal(spellBalance);
    const tvlUsd = tvl.times(spellPrice);


    const mspell = getOrCreateMspell();
    mspell.totalValueLocked = tvl;
    mspell.totalValueLockedUsd = tvlUsd;
    mspell.save();

    const dailySnapshot = getOrCreateMspellDailySnapshot(block);
    dailySnapshot.totalValueLocked = tvl;
    dailySnapshot.totalValueLockedUsd = tvlUsd;
    dailySnapshot.save();

    const hourySnapshot = getOrCreateMspellHourySnapshot(block);
    hourySnapshot.totalValueLocked = tvl;
    hourySnapshot.totalValueLockedUsd = tvlUsd;
    hourySnapshot.save();
}