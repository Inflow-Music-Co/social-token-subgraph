import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { FACTORY_ADDRESS,ONE_BI,ONE_BD, ZERO_BD, ZERO_BI } from './constants'

export function bitsToToken(value:BigInt,decimal:u8): BigDecimal {
    return value.toBigDecimal().div(BigInt.fromI32(10).pow(decimal).toBigDecimal())
}