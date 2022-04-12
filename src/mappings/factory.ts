import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { SocialTokenCreated } from "../../generated/Factory/Factory"
import { Create, Factory} from "../../generated/schema"
import { loadTransaction } from '../utils/index'


export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)
export const FACTORY_ADDRESS = '0x0024B65D2F4c399467541783d662f198a8627d68'

export function handleSocialTokenCreated(event: SocialTokenCreated):void {


    let transaction = loadTransaction(event)
    let factory = Factory.load(FACTORY_ADDRESS)
    if(factory === null){
        factory = new Factory(FACTORY_ADDRESS);
    }

    factory.tokenCount = factory.tokenCount.plus(ONE_BI)

    let create = new Create(transaction.id + '#' + factory.tokenCount.toString())
    create.ownerAddress = event.params.creator
    create.tokenAddress = event.params.socialToken
    create.timestamp = transaction.timestamp

    factory.save()
    create.save()
}