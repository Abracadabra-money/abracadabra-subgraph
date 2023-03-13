import { LogDeploy } from '../../generated/BentoBox/BentoBox';
import { ABRA_DEPLOYERS } from '../constants';
import { createCauldron } from '../helpers/cauldron';

export function handleLogDeploy(event: LogDeploy): void {
    const account = event.transaction.from.toHex().toLowerCase();

    if (ABRA_DEPLOYERS.includes(account)) {
        createCauldron(event.params.cloneAddress, event.block.number, event.block.timestamp);
    }
}
