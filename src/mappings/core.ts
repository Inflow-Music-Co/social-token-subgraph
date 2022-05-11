import { BigInt, BigDecimal, Address ,store} from '@graphprotocol/graph-ts'
import { Minted as MintedEvent, Burned as BurnedEvent, Transfer as TransferEvent, Approval as ApprovalEvent} from "../../generated/templates/SocialToken/SocialToken"
import { SocialToken } from '../../generated/templates'
import { Minted,Burned,Factory,Create,Transfer,Approval, Token, Holder} from "../../generated/schema"
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
    minted.tokenAddress = event.params.tokenAddress.toHexString()
    minted.mintPrice = event.params.mintPrice
    minted.amount = event.params.amount
    minted.unitPrice = bitsToToken(event.params.mintPrice,6).div(bitsToToken(event.params.amount,18))
    minted.tokenSupply = event.params.tokenSupply
    minted.royaltyPaid = event.params.royaltyPaid
    minted.reserve = event.params.reserve
    minted.timestamp = event.block.timestamp

    let token = Token.load(event.address.toHex())
    if(token == null){
        token = new Token(event.address.toHex())
        token.tokenAddress = event.address.toHexString()
        token.holders = BigInt.fromI32(0)
        token.burned = BigInt.fromI32(0)
        token.numMint = BigInt.fromI32(0)
        token.totalSpent = BigInt.fromI32(0)
    }
    
    token.totalFees = token.totalFees.plus(event.params.royaltyPaid)
    token.lastMintedUnitPrice = bitsToToken(event.params.mintPrice,6).div(bitsToToken(event.params.amount,18))
    token.numMint = token.numMint.plus(ONE_BI)
    token.totalSpent = token.totalSpent.plus(event.params.mintPrice)
    token.averageSpend = token.totalSpent.div(token.numMint)

    factory.save()
    minted.save()
    token.save()
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
    let token = Token.load(event.address.toHex())
    if(token == null){
        token = new Token(event.address.toHex())
        token.tokenAddress = event.address.toHexString()
        token.holders = BigInt.fromI32(0)
        token.burned = BigInt.fromI32(0)
    }
    updateBalance(token, event.params.from,event.params.value,false)
    updateBalance(token, event.params.to, event.params.value, true)

    factory.txCount = factory.txCount.plus(ONE_BI)

    let transfer = new Transfer(transaction.id.toString())
    transfer.from = event.params.from
    transfer.to = event.params.to
    transfer.value = event.params.value
    
    factory.save()
    token.save()
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


function updateBalance(token: Token, holderAddress: Address, value: BigInt, increase: boolean): void{
    if(holderAddress.toHexString() == '0x0000000000000000000000000000000000000000'){
        if(increase) {
            token.burned = token.burned.plus(value)
            token.save()
        }
        return
    }

    let tokenAddress = token.tokenAddress
    let id = tokenAddress + '-' + holderAddress.toHexString()
    let holder = Holder.load(id)
    if( holder == null){
        holder = new Holder(id)
        holder.address = holderAddress
        holder.balance = BigInt.fromI32(0)
        holder.token = tokenAddress
        token.holders = token.holders.plus(BigInt.fromI32(1));
    }
    holder.balance = increase ? holder.balance.plus(value) : holder.balance.minus(value)
    if(holder.balance.le(BigInt.fromI32(0))){
        store.remove('Holder', id);
        token.holders = token.holders.minus(BigInt.fromI32(1))
    }else{
        holder.save()
    }
    token.save()
}


