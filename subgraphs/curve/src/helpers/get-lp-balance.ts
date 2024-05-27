import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Pool } from '../../generated/Pool/Pool';
import { POOL_ADDRESS } from '../constants';

export function getLpBalance(account: Address): BigInt {
    const contract = Pool.bind(Address.fromString(POOL_ADDRESS));
    return contract.balanceOf(account);
}
