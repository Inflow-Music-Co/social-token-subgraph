import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { Minted as MintedEvent, Burned as BurnedEvent} from "../../generated/templates/SocialToken/SocialToken"
import { Minted,Factory} from "../../generated/schema"
import { loadTransaction } from '../utils/index'
import { FACTORY_ADDRESS,ONE_BI, ZERO_BD, ZERO_BI } from '../utils/constants'



export function handleMinted(event: MintedEvent):void {


    let transaction = loadTransaction(event)


    let minted = new Minted(transaction.id.toString())
    minted.minter = event.params.minter
    minted.mintPrice = event.params.mintPrice
    minted.amount = event.params.amount
    minted.tokenSupply = event.params.tokenSupply
    minted.royaltyPaid = event.params.royaltyPaid
    minted.reserve = event.params.reserve

    minted.save()
}

export function handleBurned(event: BurnedEvent): void{
    let transaction = loadTransaction(event)
    let factory = Factory.load(FACTORY_ADDRESS)
    if(factory === null){
        factory = new Factory(FACTORY_ADDRESS);
    }

    factory.txCount = factory.txCount.plus(ONE_BI)

    let Burned = new Minted(transaction.id.toString() + '#' + factory.tokenCount.toString())
    Burned.minter = event.params.burner
    Burned.amount = event.params.amount
    Burned.mintPrice = event.params.burnPrice
    Burned.tokenSupply = event.params.tokenSupply
    Burned.reserve = event.params.reserve

    factory.save()
    Burned.save()
}

