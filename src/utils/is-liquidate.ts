import { ethereum } from '@graphprotocol/graph-ts';

export function isLiquidate(event: ethereum.Event): boolean {
    const method = event.transaction.input.toHexString().substr(0, 10);
    return method === '0x912860c5' || method === '0xff6ff84b';
}

// 0x912860c5 -> liquidate(address[],uint256[],address,address)
// 0xff6ff84b -> liquidate(address[],uint256[],address,address,bytes)
