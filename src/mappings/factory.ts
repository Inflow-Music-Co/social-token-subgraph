import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { SocialTokenCreated,Whitelisted } from "../../generated/Factory/Factory"
import { Create, Factory, Whitelist} from "../../generated/schema"
import { loadTransaction } from '../utils/index'
import { FACTORY_ADDRESS,ONE_BI, ZERO_BD, ZERO_BI } from '../utils/constants'
import { SocialToken as SocialTokenTemplate } from '../../generated/templates'


export function handleSocialTokenCreated(event: SocialTokenCreated):void {


    let transaction = loadTransaction(event)
    let factory = Factory.load(FACTORY_ADDRESS)
    if(factory === null){
        factory = new Factory(FACTORY_ADDRESS);
    }

    factory.tokenCount = factory.tokenCount.plus(ONE_BI)
    factory.txCount = factory.txCount.plus(ONE_BI)

    let create = new Create(transaction.id + '#' + factory.tokenCount.toString())
    create.creatorAddress = event.params.creator
    create.tokenAddress = event.params.socialToken
    create.timestamp = transaction.timestamp

    SocialTokenTemplate.create(event.params.socialToken)
    factory.save()
    create.save()
}

export function handleWhitelisted(event: Whitelisted):void {

    let transaction = loadTransaction(event)
    let whitelist = new Whitelist(event.params.account.toHexString())
    whitelist.timestamp = transaction.timestamp
    whitelist.save()
}