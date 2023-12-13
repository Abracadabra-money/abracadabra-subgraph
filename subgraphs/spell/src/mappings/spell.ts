import { Address } from '@graphprotocol/graph-ts';
import { Transfer } from '../../generated/Spell/Spell';
import { getOrCreateSpell } from '../helpers/get-or-create-spell';
import { getOrCreateSpellDailySnapshot } from '../helpers/get-or-create-spell-daily-snapshot';
import { getOrCreateSpellHourySnapshot } from '../helpers/get-or-create-spell-houry-snapshot';
import { ZERO_ADDRESS, bigIntToBigDecimal } from 'misc';
import { getSpellPrice } from '../helpers/get-spell-price';
import { HASHES } from '../constants';

export function handleLogTransfer(event: Transfer): void {
    const hash = event.transaction.hash.toHexString();
    if(HASHES.includes(hash)) return;

    const dailySnapshot = getOrCreateSpellDailySnapshot(event.block);
    const hourySnapshot = getOrCreateSpellHourySnapshot(event.block);
    const spell = getOrCreateSpell();

    const spellPrice = getSpellPrice();

    const amount = bigIntToBigDecimal(event.params._value);
    const amountUsd = amount.times(spellPrice);

    if (event.params._from.equals(Address.fromString(ZERO_ADDRESS))) {
        spell.totalMinted = spell.totalMinted.plus(amount);
        spell.totalMintedUsd = spell.totalMintedUsd.plus(amountUsd);

        dailySnapshot.minted = dailySnapshot.minted.plus(amount);
        dailySnapshot.mintedUsd = dailySnapshot.mintedUsd.plus(amountUsd);
        dailySnapshot.totalMinted = spell.totalMinted;
        dailySnapshot.totalMintedUsd = spell.totalMintedUsd;

        hourySnapshot.minted = hourySnapshot.minted.plus(amount);
        hourySnapshot.mintedUsd = hourySnapshot.mintedUsd.plus(amountUsd);
        hourySnapshot.totalMinted = spell.totalMinted;
        hourySnapshot.totalMintedUsd = spell.totalMintedUsd;
    }

    if (event.params._to.equals(Address.fromString(ZERO_ADDRESS))) {
        spell.totalBurned = spell.totalBurned.plus(amount);
        spell.totalBurnedUsd = spell.totalBurnedUsd.plus(amountUsd);

        dailySnapshot.burned = dailySnapshot.burned.plus(amount);
        dailySnapshot.burnedUsd = dailySnapshot.burnedUsd.plus(amountUsd);
        dailySnapshot.totalBurned = spell.totalBurned;
        dailySnapshot.totalBurnedUsd = spell.totalBurnedUsd;

        hourySnapshot.burned = hourySnapshot.burned.plus(amount);
        hourySnapshot.burnedUsd = hourySnapshot.burnedUsd.plus(amountUsd);
        hourySnapshot.totalBurned = spell.totalBurned;
        hourySnapshot.totalBurnedUsd = spell.totalBurnedUsd;
    }

    spell.save();
    dailySnapshot.save();
    hourySnapshot.save();
}
