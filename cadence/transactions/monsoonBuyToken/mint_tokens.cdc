import FungibleToken from "../../contracts/FungibleToken.cdc"
import monsoonBuyToken from "../../contracts/monsoonBuyToken.cdc"

transaction(recipient: Address, amount: UFix64) {
    let tokenAdmin: &monsoonBuyToken.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tokenAdmin = signer
        .borrow<&monsoonBuyToken.Administrator>(from: monsoonBuyToken.AdminStoragePath)
        ?? panic("Signer is not the token admin")

        self.tokenReceiver = getAccount(recipient)
        .getCapability(monsoonBuyToken.ReceiverPublicPath)!
        .borrow<&{FungibleToken.Receiver}>()
        ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        let mintedVault <- minter.mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)

        destroy minter
    }
}
