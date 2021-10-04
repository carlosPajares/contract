import monsoonBuyToken from "../../contracts/monsoonBuyToken.cdc"

// This script returns the total amount of monsoonBuyToken currently in existence.

pub fun main(): UFix64 {

    let supply = monsoonBuyToken.totalSupply

    log(supply)

    return supply
}
