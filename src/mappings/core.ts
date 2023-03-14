import { LogDeploy } from '../../generated/BentoBox/BentoBox';
import { ABRA_DEPLOYERS } from '../constants';
import { createCauldron } from '../helpers/cauldron';
import { Cauldron } from '../../generated/templates';

export function handleLogDeploy(event: LogDeploy): void {
    const account = event.transaction.from.toHex().toLowerCase();

    if (ABRA_DEPLOYERS.includes(account)) {
        createCauldron(event.params.cloneAddress, event.block.number, event.block.timestamp, event.params.data);
        Cauldron.create(event.params.cloneAddress);
    }
}
