import { Cauldron } from '../../../generated/schema';
import { log } from '@graphprotocol/graph-ts';

export function getCauldron(id: string): Cauldron | null {
    const cauldron = Cauldron.load(id);
    if (cauldron) return cauldron;
    log.error('Cannot find cauldron', [id]);
    return null;
}
