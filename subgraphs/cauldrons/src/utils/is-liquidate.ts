import { ethereum, Bytes, log } from '@graphprotocol/graph-ts';

const LOG_REMOVE_COLLATERAL_TOPIC = Bytes.fromHexString('0x8ad4d3ff00da092c7ad9a573ea4f5f6a3dffc6712dc06d3f78f49b862297c402'); // LogRemoveCollateral(address,address,uint256)
const LOG_REPAY_TOPIC = Bytes.fromHexString('0xc8e512d8f188ca059984b5853d2bf653da902696b8512785b182b2c813789a6e'); // LogRepay(address,address,uint256,uint256)

export function isLiquidate(event: ethereum.Event): boolean {
    const receipt = event.receipt;
    if (!receipt) {
        log.error('Event must have receipt to check if it is a liquidation', []);
        return false;
    }
    const logs = receipt.logs;

    const logIndexInTransaction = event.logIndex.minus(logs[0].logIndex).abs().toI32();
    const currentLog = logs[logIndexInTransaction];

    if (currentLog.topics.length <= 0) {
        log.warning('Only LogRepay and LogRemoveCollateral can be a liquidation, but log had no topics. Transaction hash: {}, log index: {}', [
            event.transaction.hash.toHexString(),
            logIndexInTransaction.toString(),
        ]);
    }

    if (currentLog.topics[0] == LOG_REPAY_TOPIC) {
        if (logIndexInTransaction == 0) {
            return false; // Not a liquidation if LogRepay is first log in the transaction
        }
        const topics = logs[logIndexInTransaction - 1].topics;
        return topics.length > 0 && topics[0] == LOG_REMOVE_COLLATERAL_TOPIC;
    } else if (currentLog.topics[0] == LOG_REMOVE_COLLATERAL_TOPIC) {
        // Not possible for LogRemoveCollateral to be the last log in a transaction, thus safe
        const topics = logs[logIndexInTransaction + 1].topics;
        return topics.length > 0 && topics[0] == LOG_REPAY_TOPIC;
    } else {
        log.warning('Only LogRepay and LogRemoveCollateral can be a liquidation, but got topic0: {}. Transaction hash: {}, log index: {}', [
            currentLog.topics[0].toHexString(),
            event.transaction.hash.toHexString(),
            logIndexInTransaction.toString(),
        ]);
        return false;
    }
}
