import { BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly';
import { LogRepay } from '../../generated/templates/Cauldron/Cauldron';
import { BLOCK_NUMBER, BLOCK_TIMESTAMP, CLONE_ADDRESS, MOCK_ACCOUNT } from '../constants';

export function createLogRepay(): LogRepay {
    const log: LogRepay = changetype<LogRepay>(newMockEvent());

    log.block.number = BLOCK_NUMBER;
    log.block.timestamp = BLOCK_TIMESTAMP;
    log.address = CLONE_ADDRESS;
    log.transaction.input = Bytes.fromHexString(
        '0x912860c5000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000ef633d1af20ed99a69b7cf46da5be63da07ed5ee000000000000000000000000ef633d1af20ed99a69b7cf46da5be63da07ed5ee00000000000000000000000000000000000000000000000000000000000000020000000000000000000000004ee82b2990c0a65f7793e7c51cb87cf596fb98e30000000000000000000000007c3ffcad1d967889a1e9969aca6251b6f7441da400000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000004419f1bb792af1e494800000000000000000000000000000000000000000000000000002b8821a17a11',
    );

    log.parameters = new Array();
    log.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(MOCK_ACCOUNT)));
    log.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(MOCK_ACCOUNT)));
    log.parameters.push(new ethereum.EventParam('amount', ethereum.Value.fromUnsignedBigInt(BigInt.fromString('20103561731267914295418'))));
    log.parameters.push(new ethereum.EventParam('part', ethereum.Value.fromUnsignedBigInt(BigInt.fromString('20099969255386734545224'))));

    return log;
}
