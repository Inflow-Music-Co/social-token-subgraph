import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { Minted as MintedEvent, Burned as BurnedEvent} from "../../generated/templates/SocialToken/SocialToken"
import { SocialToken } from '../../generated/templates'
import { Minted,Burned,Factory,Create} from "../../generated/schema"
import { loadTransaction } from '../utils/index'
import { FACTORY_ADDRESS,ONE_BI, ZERO_BD, ZERO_BI } from '../utils/constants'



export function handleMinted(event: MintedEvent):void {

  
    
    let transaction = loadTransaction(event)
    let factory = Factory.load(FACTORY_ADDRESS)
    if(factory === null){
        factory = new Factory(FACTORY_ADDRESS);
    }
    
    factory.txCount = factory.txCount.plus(ONE_BI)
    
    let minted = new Minted(transaction.id.toString())
    minted.minter = event.params.minter
    minted.mintPrice = event.params.mintPrice
    minted.amount = event.params.amount
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
    burned.amount = event.params.amount
    burned.burnPrice = event.params.burnPrice
    burned.tokenSupply = event.params.tokenSupply
    burned.reserve = event.params.reserve
    burned.timestamp = event.block.timestamp

    factory.save()
    burned.save()
}

