import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { Minted as MintedEvent, Burned as BurnedEvent, Transfer as TransferEvent, Approval as ApprovalEvent} from "../../generated/templates/SocialToken/SocialToken"
import { SocialToken } from '../../generated/templates'
import { Minted,Burned,Factory,Create,Transfer,Approval} from "../../generated/schema"
import { loadTransaction } from '../utils/index'
import { FACTORY_ADDRESS,ONE_BI,ONE_BD, ZERO_BD, ZERO_BI } from '../utils/constants'
import {bitsToToken} from "../utils/helpers"


export function handleMinted(event: MintedEvent):void {
    
    let transaction = loadTransaction(event)
    let factory = Factory.load(FACTORY_ADDRESS)
    if(factory === null){
        factory = new Factory(FACTORY_ADDRESS);
    }
    
    factory.txCount = factory.txCount.plus(ONE_BI)
    
    let minted = new Minted(transaction.id.toString())
    minted.minter = event.params.minter
    minted.tokenAddress = event.params.tokenAddress
    minted.mintPrice = event.params.mintPrice
    minted.amount = event.params.amount
    minted.unitPrice = bitsToToken(event.params.mintPrice,6).div(bitsToToken(event.params.amount,18))
    minted.tokenSupply = event.params.tokenSupply
    minted.royaltyPaid = event.params.royaltyPaid
    minted.reserve = event.params.reserve
    minted.timestamp = event.block.timestamp

    factory.save()
    minted.save()
}

export function handleBurned(event: BurnedEvent): void{
    let transaction = loadTransaction(event)
    let factory = Factory.load(FACTORY_ADDRESS)
    if(factory === null){
        factory = new Factory(FACTORY_ADDRESS);
    }

    factory.txCount = factory.txCount.plus(ONE_BI)

    let burned = new Burned(transaction.id.toString())
    burned.burner = event.params.burner
    burned.tokenAddress = event.params.tokenAddress
    burned.amount = event.params.amount
    burned.burnPrice = event.params.burnPrice
    burned.unitPrice = bitsToToken(event.params.burnPrice,6).div(bitsToToken(event.params.amount,18))
    burned.tokenSupply = event.params.tokenSupply
    burned.reserve = event.params.reserve
    burned.timestamp = event.block.timestamp

    factory.save()
    burned.save()
}

export function handleTransfer(event: TransferEvent): void {
    let transaction = loadTransaction(event)
    let factory = Factory.load(FACTORY_ADDRESS)
    if(factory === null){
        factory = new Factory(FACTORY_ADDRESS);
    }

    factory.txCount = factory.txCount.plus(ONE_BI)

    let transfer = new Transfer(transaction.id.toString())
    transfer.from = event.params.from
    transfer.to = event.params.to
    transfer.value = event.params.value

    factory.save()
    transfer.save()
}

export function handleApprovalEvent(event: ApprovalEvent): void {
    let transaction = loadTransaction(event)
    let factory = Factory.load(FACTORY_ADDRESS)
    if(factory === null){
        factory = new Factory(FACTORY_ADDRESS);
    }

    factory.txCount = factory.txCount.plus(ONE_BI)

    let approval = new Approval(transaction.id.toString())
    approval.owner = event.params.owner
    approval.spender = event.params.spender
    approval.value = event.params.value

    factory.save()
    approval.save()
}



