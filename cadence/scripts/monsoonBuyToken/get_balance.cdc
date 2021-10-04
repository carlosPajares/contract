import monsoonBuyToken from "../../contracts/monsoonBuyToken.cdc"
import FungibleToken from "../../contracts/FungibleToken.cdc"

// This script returns an account's monsoonBuyToken balance.

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
    
    let vaultRef = account.getCapability(monsoonBuyToken.BalancePublicPath)!.borrow<&monsoonBuyToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
