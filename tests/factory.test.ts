import { SocialTokenCreated } from "../generated/Factory/Factory"
import { Address, ethereum } from "@graphprotocol/graph-ts"
import {newMockEvent,test, assert} from "matchstick-as/assembly/index"
import {handleSocialTokenCreated} from "../src/mappings/factory"
import { Create } from "../generated/schema"

export function createSocialTokenCreatedEvent(socialToken: string, creator: string): SocialTokenCreated{
    let socialTokenCreatedEvent = changetype<SocialTokenCreated>(newMockEvent())
    socialTokenCreatedEvent.parameters = new Array()
    // let idParam = new ethereum.EventParam("id", ethereum.Value.fromI32(id))
    let socialTokenParam= new ethereum.EventParam("socialToken", ethereum.Value.fromAddress(Address.fromString(socialToken)))
    let creatorParam = new ethereum.EventParam("creator", ethereum.Value.fromAddress(Address.fromString(creator)))

    // socialTokenCreatedEvent.parameters.push(idParam)
    socialTokenCreatedEvent.parameters.push(socialTokenParam)
    socialTokenCreatedEvent.parameters.push(creatorParam)

    return socialTokenCreatedEvent
}

test("Can handle SocialTokenCreated", () => {
    
    let create = new Create("0x123");
    create.tokenAddress = Address.fromString("0x0024B65D2F4c399467541783d662f198a8627d68");
    create.save()

    let socialTokenCreatedEvent = createSocialTokenCreatedEvent(
        "0x0024B65D2F4c399467541783d662f198a8627d68",
        "0x0034B65D2F4c399467541783d662f198a8627d68"
    )

    handleSocialTokenCreated(socialTokenCreatedEvent)
    let val = "f"
    assert.fieldEquals('Create', '0x123', 'id', '0x123')
    // assert.fieldEquals("Create","0x123","socialToken","0x0024B65D2F4c399467541783d662f198a8627d68")
    // assert.fieldEquals("Create","0x123","creator","0x0034B65D2F4c399467541783d662f198a8627d68")
})