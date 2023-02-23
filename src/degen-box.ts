import {
  DegenBoxLogDeploy as DegenBoxLogDeployEvent,
  DegenBoxLogDeposit as DegenBoxLogDepositEvent,
  DegenBoxLogFlashLoan as DegenBoxLogFlashLoanEvent,
  DegenBoxLogRegisterProtocol as DegenBoxLogRegisterProtocolEvent,
  DegenBoxLogSetMasterContractApproval as DegenBoxLogSetMasterContractApprovalEvent,
  DegenBoxLogStrategyDivest as DegenBoxLogStrategyDivestEvent,
  DegenBoxLogStrategyInvest as DegenBoxLogStrategyInvestEvent,
  DegenBoxLogStrategyLoss as DegenBoxLogStrategyLossEvent,
  DegenBoxLogStrategyProfit as DegenBoxLogStrategyProfitEvent,
  DegenBoxLogStrategyQueued as DegenBoxLogStrategyQueuedEvent,
  DegenBoxLogStrategySet as DegenBoxLogStrategySetEvent,
  DegenBoxLogStrategyTargetPercentage as DegenBoxLogStrategyTargetPercentageEvent,
  DegenBoxLogTransfer as DegenBoxLogTransferEvent,
  DegenBoxLogWhiteListMasterContract as DegenBoxLogWhiteListMasterContractEvent,
  DegenBoxLogWithdraw as DegenBoxLogWithdrawEvent,
  DegenBoxOwnershipTransferred as DegenBoxOwnershipTransferredEvent
} from "../generated/DegenBox/DegenBox"
import {
  DegenBoxLogDeploy,
  DegenBoxLogDeposit,
  DegenBoxLogFlashLoan,
  DegenBoxLogRegisterProtocol,
  DegenBoxLogSetMasterContractApproval,
  DegenBoxLogStrategyDivest,
  DegenBoxLogStrategyInvest,
  DegenBoxLogStrategyLoss,
  DegenBoxLogStrategyProfit,
  DegenBoxLogStrategyQueued,
  DegenBoxLogStrategySet,
  DegenBoxLogStrategyTargetPercentage,
  DegenBoxLogTransfer,
  DegenBoxLogWhiteListMasterContract,
  DegenBoxLogWithdraw,
  DegenBoxOwnershipTransferred
} from "../generated/schema"

export function handleDegenBoxLogDeploy(event: DegenBoxLogDeployEvent): void {
  let entity = new DegenBoxLogDeploy(
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

export function handleDegenBoxLogDeposit(event: DegenBoxLogDepositEvent): void {
  let entity = new DegenBoxLogDeposit(
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

export function handleDegenBoxLogFlashLoan(
  event: DegenBoxLogFlashLoanEvent
): void {
  let entity = new DegenBoxLogFlashLoan(
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

export function handleDegenBoxLogRegisterProtocol(
  event: DegenBoxLogRegisterProtocolEvent
): void {
  let entity = new DegenBoxLogRegisterProtocol(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.protocol = event.params.protocol

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDegenBoxLogSetMasterContractApproval(
  event: DegenBoxLogSetMasterContractApprovalEvent
): void {
  let entity = new DegenBoxLogSetMasterContractApproval(
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

export function handleDegenBoxLogStrategyDivest(
  event: DegenBoxLogStrategyDivestEvent
): void {
  let entity = new DegenBoxLogStrategyDivest(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDegenBoxLogStrategyInvest(
  event: DegenBoxLogStrategyInvestEvent
): void {
  let entity = new DegenBoxLogStrategyInvest(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDegenBoxLogStrategyLoss(
  event: DegenBoxLogStrategyLossEvent
): void {
  let entity = new DegenBoxLogStrategyLoss(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDegenBoxLogStrategyProfit(
  event: DegenBoxLogStrategyProfitEvent
): void {
  let entity = new DegenBoxLogStrategyProfit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDegenBoxLogStrategyQueued(
  event: DegenBoxLogStrategyQueuedEvent
): void {
  let entity = new DegenBoxLogStrategyQueued(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.strategy = event.params.strategy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDegenBoxLogStrategySet(
  event: DegenBoxLogStrategySetEvent
): void {
  let entity = new DegenBoxLogStrategySet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.strategy = event.params.strategy

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDegenBoxLogStrategyTargetPercentage(
  event: DegenBoxLogStrategyTargetPercentageEvent
): void {
  let entity = new DegenBoxLogStrategyTargetPercentage(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.token = event.params.token
  entity.targetPercentage = event.params.targetPercentage

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDegenBoxLogTransfer(
  event: DegenBoxLogTransferEvent
): void {
  let entity = new DegenBoxLogTransfer(
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

export function handleDegenBoxLogWhiteListMasterContract(
  event: DegenBoxLogWhiteListMasterContractEvent
): void {
  let entity = new DegenBoxLogWhiteListMasterContract(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.masterContract = event.params.masterContract
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDegenBoxLogWithdraw(
  event: DegenBoxLogWithdrawEvent
): void {
  let entity = new DegenBoxLogWithdraw(
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

export function handleDegenBoxOwnershipTransferred(
  event: DegenBoxOwnershipTransferredEvent
): void {
  let entity = new DegenBoxOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
