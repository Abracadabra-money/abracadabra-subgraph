import { Address, ethereum } from '@graphprotocol/graph-ts';
import { Cauldron } from '../../../generated/schema';
import { EventType } from '../../constants';
import { getAccountBalance } from './get-account-balance';
import { getOrCreateAccount } from './get-or-create-account';
import { addPosition } from './add-position';
import { subtractPosition } from './subtract-position';

export function updatePosition(side: string, cauldron: Cauldron, eventType: string, accountAddress: string, event: ethereum.Event, liquidation: boolean = false): string {
    const account = getOrCreateAccount(accountAddress, cauldron, event.block);

    const balance = getAccountBalance(Address.fromString(cauldron.id), Address.fromString(accountAddress), side);

    if ([EventType.DEPOSIT, EventType.BORROW].includes(eventType)) {
        return addPosition(cauldron, account, balance, eventType, side, event).id;
    } else {
        const position = subtractPosition(cauldron, account, balance, eventType, side, event);
        if (!position) return '';
        if (liquidation) {
            position.liquidationCount += 1;
            position.save();
        }
        return position.id;
    }
}
