import {
  LogDeploy as LogDeployEvent,
  LogDeposit as LogDepositEvent,
  LogFlashLoan as LogFlashLoanEvent,
  LogRegisterProtocol as LogRegisterProtocolEvent,
  LogSetMasterContractApproval as LogSetMasterContractApprovalEvent,
  LogStrategyDivest as LogStrategyDivestEvent,
  LogStrategyInvest as LogStrategyInvestEvent,
  LogStrategyLoss as LogStrategyLossEvent,
  LogStrategyProfit as LogStrategyProfitEvent,
  LogStrategyQueued as LogStrategyQueuedEvent,
  LogStrategySet as LogStrategySetEvent,
  LogStrategyTargetPercentage as LogStrategyTargetPercentageEvent,
  LogTransfer as LogTransferEvent,
  LogWhiteListMasterContract as LogWhiteListMasterContractEvent,
  LogWithdraw as LogWithdrawEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/BentoBox/BentoBox"
import {
  LogDeploy,
  LogDeposit,
  LogFlashLoan,
  LogRegisterProtocol,
  LogSetMasterContractApproval,
  LogStrategyDivest,
  LogStrategyInvest,
  LogStrategyLoss,
  LogStrategyProfit,
  LogStrategyQueued,
  LogStrategySet,
  LogStrategyTargetPercentage,
  LogTransfer,
  LogWhiteListMasterContract,
  LogWithdraw,
  OwnershipTransferred
} from "../generated/schema"

export function handleLogDeploy(event: LogDeployEvent): void {
  let entity = new LogDeploy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.masterContract = event.params.masterContract
  entity.data = event.params.data
  entity.cloneAddress = event.params.cloneAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogDeposit(event: LogDepositEvent): void {
  let entity = new LogDeposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.share = event.params.share

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogFlashLoan(event: LogFlashLoanEvent): void {
  let entity = new LogFlashLoan(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.borrower = event.params.borrower
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.feeAmount = event.params.feeAmount
  entity.receiver = event.params.receiver

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogRegisterProtocol(
  event: LogRegisterProtocolEvent
): void {
  let entity = new LogRegisterProtocol(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.protocol = event.params.protocol

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogSetMasterContractApproval(
  event: LogSetMasterContractApprovalEvent
): void {
  let entity = new LogSetMasterContractApproval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.masterContract = event.params.masterContract
  entity.user = event.params.user
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogStrategyDivest(event: LogStrategyDivestEvent): void {
  let entity = new LogStrategyDivest(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogStrategyInvest(event: LogStrategyInvestEvent): void {
  let entity = new LogStrategyInvest(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogStrategyLoss(event: LogStrategyLossEvent): void {
  let entity = new LogStrategyLoss(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogStrategyProfit(event: LogStrategyProfitEvent): void {
  let entity = new LogStrategyProfit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogStrategyQueued(event: LogStrategyQueuedEvent): void {
  let entity = new LogStrategyQueued(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.strategy = event.params.strategy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogStrategySet(event: LogStrategySetEvent): void {
  let entity = new LogStrategySet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.strategy = event.params.strategy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogStrategyTargetPercentage(
  event: LogStrategyTargetPercentageEvent
): void {
  let entity = new LogStrategyTargetPercentage(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.targetPercentage = event.params.targetPercentage

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogTransfer(event: LogTransferEvent): void {
  let entity = new LogTransfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.from = event.params.from
  entity.to = event.params.to
  entity.share = event.params.share

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogWhiteListMasterContract(
  event: LogWhiteListMasterContractEvent
): void {
  let entity = new LogWhiteListMasterContract(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.masterContract = event.params.masterContract
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLogWithdraw(event: LogWithdrawEvent): void {
  let entity = new LogWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount
  entity.share = event.params.share

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
