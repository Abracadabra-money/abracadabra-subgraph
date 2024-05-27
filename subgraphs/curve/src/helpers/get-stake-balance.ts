import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Stake } from '../../generated/Stake/stake';
import { STAKE_ADDRESS } from '../constants';

export function getStakeBalance(account: Address): BigInt {
    const contract = Stake.bind(Address.fromString(STAKE_ADDRESS));
    return contract.balanceOf(account);
}
