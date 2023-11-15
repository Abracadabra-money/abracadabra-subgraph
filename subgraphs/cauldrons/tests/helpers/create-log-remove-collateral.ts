import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly';
import { LogRemoveCollateral } from '../../generated/templates/Cauldron/Cauldron';
import { BLOCK_NUMBER, BLOCK_TIMESTAMP, CLONE_ADDRESS, REMOVE_COLLATERAL_EVENT_LOG_INDEX, MOCK_ACCOUNT, TRANSACTION_HASH } from '../constants';

export function createLogRemoveCollateral(): LogRemoveCollateral {
    const log: LogRemoveCollateral = changetype<LogRemoveCollateral>(newMockEvent());

    log.block.number = BLOCK_NUMBER;
    log.block.timestamp = BLOCK_TIMESTAMP;
    log.logIndex = REMOVE_COLLATERAL_EVENT_LOG_INDEX;
    log.transaction.hash = TRANSACTION_HASH;
    log.address = CLONE_ADDRESS;

    const eventLogs: ethereum.Log[] = [
        new ethereum.Log(
            Address.fromString('0x9617b633EF905860D919b88E1d9d9a6191795341'),
            [
                Bytes.fromHexString('0x8ad4d3ff00da092c7ad9a573ea4f5f6a3dffc6712dc06d3f78f49b862297c402'),
                Bytes.fromHexString('0x000000000000000000000000779b400527494c5c195680cf2d58302648481d50'),
                Bytes.fromHexString('0x000000000000000000000000e0d6b751ab1b28098d581d1f2265e76e16a3f10e'),
            ],
            Bytes.empty(),
            Bytes.empty(),
            Bytes.empty(),
            Bytes.empty(),
            BigInt.fromI32(79),
            BigInt.fromI32(0),
            BigInt.fromI32(0),
            '0x',
            null,
        ),
        new ethereum.Log(
            Address.fromString('0x9617b633EF905860D919b88E1d9d9a6191795341'),
            [
                Bytes.fromHexString('0xc8e512d8f188ca059984b5853d2bf653da902696b8512785b182b2c813789a6e'),
                Bytes.fromHexString('0x000000000000000000000000e0d6b751ab1b28098d581d1f2265e76e16a3f10e'),
                Bytes.fromHexString('0x000000000000000000000000779b400527494c5c195680cf2d58302648481d50'),
            ],
            Bytes.empty(),
            Bytes.empty(),
            Bytes.empty(),
            Bytes.empty(),
            BigInt.fromI32(79),
            BigInt.fromI32(1),
            BigInt.fromI32(0),
            '0x',
            null,
        ),
    ];

    log.receipt = new ethereum.TransactionReceipt(
        Bytes.fromHexString('0x834f743bfd0e544e508618fe61022dbc747c8eb68996bfbcb8f14041daf15d2c'),
        BigInt.fromI32(79),
        Bytes.fromHexString('0x240ba21032b84c5a77f3ab01b6f05bebb5320f3483a51c3f5aff7f1e6594f81c'),
        BigInt.fromI32(16989558),
        BigInt.fromI32(8199547),
        BigInt.fromI32(275105),
        Address.fromString('0x9617b633EF905860D919b88E1d9d9a6191795341'),
        eventLogs,
        BigInt.fromI32(1),
        Bytes.empty(),
        Bytes.fromHexString(
            '0x00000000000000400000000000000804000000000000000000000001000040000000001000000000000000000200000000000008100000000000000000000802000000800000002000010000800000000000000000008000000000000100008800000008000020000000000000000000000000002000004000000000000080000000000210000000000000000002000010000000100500020000008000000000000000000000000000002000000000000000000000000080000000000000000800000000000000000004000000810000000000004010022000000000001000000000000000000000000000080000080000001010000000000000000000000000',
        ),
    );

    log.parameters = new Array();
    log.parameters.push(new ethereum.EventParam('from', ethereum.Value.fromAddress(MOCK_ACCOUNT)));
    log.parameters.push(new ethereum.EventParam('to', ethereum.Value.fromAddress(MOCK_ACCOUNT)));
    log.parameters.push(new ethereum.EventParam('share', ethereum.Value.fromUnsignedBigInt(BigInt.fromString('30658468234870000000000'))));

    return log;
}
