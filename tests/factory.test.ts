import { SocialTokenCreated,Whitelisted } from "../generated/Factory/Factory"
import { Minted } from "../generated/templates/SocialToken/SocialToken"
import { Address, ethereum } from "@graphprotocol/graph-ts"
import {newMockEvent,test, assert} from "matchstick-as/assembly/index"
import {handleSocialTokenCreated, handleWhitelisted} from "../src/mappings/factory"
import {handleMinted } from "../src/mappings/core"
import { Create,Factory } from "../generated/schema"
import { loadTransaction } from '../src/utils/index'
import { FACTORY_ADDRESS,ONE_BI, ZERO_BD, ZERO_BI } from '../src/utils/constants'

export function createSocialTokenCreatedEvent(socialToken: Address, creator: Address): SocialTokenCreated{
    let socialTokenCreatedEvent = changetype<SocialTokenCreated>(newMockEvent())
    socialTokenCreatedEvent.parameters = new Array()

    let socialTokenParam= new ethereum.EventParam("socialToken", ethereum.Value.fromAddress(socialToken))
    let creatorParam = new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))


    socialTokenCreatedEvent.parameters.push(socialTokenParam)
    socialTokenCreatedEvent.parameters.push(creatorParam)

    return socialTokenCreatedEvent
}

export function createWhitelistedEvent(account: Address): Whitelisted{
    let whitelistedEvent = changetype<Whitelisted>(newMockEvent())
    whitelistedEvent.parameters = new Array()

    let whitelistedParam = new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
    whitelistedEvent.parameters.push(whitelistedParam)

    return whitelistedEvent
}

export function createHandleMinted(minter: Address, amount: i32,mintPrice: i32, tokenSupply:i32,royaltyPaid: i32, reserve:i32): Minted{
    let mintedEvent = changetype<Minted>(newMockEvent())
    mintedEvent.parameters = new Array()

    let minterParam = new ethereum.EventParam("minter", ethereum.Value.fromAddress(minter))
    let mintPriceParam = new ethereum.EventParam("mintPrice", ethereum.Value.fromI32(mintPrice))
    let amountParam = new ethereum.EventParam("mintPrice", ethereum.Value.fromI32(amount))
    let tokenSupplyParam = new ethereum.EventParam("mintPrice", ethereum.Value.fromI32(tokenSupply))
    let royaltyPaidParam = new ethereum.EventParam("mintPrice", ethereum.Value.fromI32(royaltyPaid))
    let reserveParam = new ethereum.EventParam("mintPrice", ethereum.Value.fromI32(reserve))
    mintedEvent.parameters.push(minterParam)
    mintedEvent.parameters.push(mintPriceParam)
    mintedEvent.parameters.push(amountParam)
    mintedEvent.parameters.push(tokenSupplyParam)
    mintedEvent.parameters.push(royaltyPaidParam)
    mintedEvent.parameters.push(reserveParam)

    return mintedEvent
}

test("Can handle Minted", () => {

    //Create event
    let mintedEvent = createHandleMinted(
        Address.fromString("0x9024B65D2F4c399467541783d662f198a8627d68"),1000,1000,999,0x123,1
    )

    handleMinted(mintedEvent)

    let transaction = loadTransaction(mintedEvent)
    let factory = Factory.load(FACTORY_ADDRESS)
    if(factory === null){
        factory = new Factory(FACTORY_ADDRESS);
    }
    assert.fieldEquals("Minted", transaction.id + '#' + factory.tokenCount.toString(),
     "minter",Address.fromString("0x9024B65D2F4c399467541783d662f198a8627d68").toHexString()
    )
    assert.fieldEquals("Minted", transaction.id + '#' + factory.tokenCount.toString(),
    "mintPrice","1000"
   )
   assert.fieldEquals("Minted", transaction.id + '#' + factory.tokenCount.toString(),
   "tokenSupply","999"
  )

})


test("Can handle SocialTokenCreated", () => {

    //Create event
    let socialTokenCreatedEvent = createSocialTokenCreatedEvent(
        Address.fromString("0x9024B65D2F4c399467541783d662f198a8627d68"),
        Address.fromString("0x0034B65D2F4c399467541783d662f198a8627d68")
    )

    handleSocialTokenCreated(socialTokenCreatedEvent)
    let transaction = loadTransaction(socialTokenCreatedEvent)
    let factory = Factory.load(FACTORY_ADDRESS)
    if(factory === null){
        factory = new Factory(FACTORY_ADDRESS);
    }

    assert.fieldEquals("Create", transaction.id + '#' + factory.tokenCount.toString(),
     "tokenAddress",Address.fromString("0x9024B65D2F4c399467541783d662f198a8627d68").toHexString()
    )
    assert.fieldEquals("Create", transaction.id + '#' + factory.tokenCount.toString(),
    "creatorAddress",Address.fromString("0x0034B65D2F4c399467541783d662f198a8627d68").toHexString()
   )
})

test("Can handle Whitelisted", () => {

    //Create event
    let whitelistedEvent = createWhitelistedEvent(
        Address.fromString("0x9024B65D2F4c399467541783d662f198a8627d68")
    )

    handleWhitelisted(whitelistedEvent)

    assert.fieldEquals("Whitelist", whitelistedEvent.params.account.toHexString(),
     "id",Address.fromString("0x9024B65D2F4c399467541783d662f198a8627d68").toHexString()
    )

})