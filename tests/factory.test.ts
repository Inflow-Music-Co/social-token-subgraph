import { SocialTokenCreated,Whitelisted } from "../generated/Factory/Factory"
import { Address, ethereum } from "@graphprotocol/graph-ts"
import {newMockEvent,test, assert} from "matchstick-as/assembly/index"
import {handleSocialTokenCreated, handleWhitelisted} from "../src/mappings/factory"
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