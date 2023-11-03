import { Transfer } from '../../generated/SSpell/SSpell';
import { updateTvl } from '../helpers/update-tvl';

export function handleLogTransfer(event: Transfer): void {
    updateTvl(event.block);
}
