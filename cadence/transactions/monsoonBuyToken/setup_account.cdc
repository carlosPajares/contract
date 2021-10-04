import FungibleToken from "../../contracts/FungibleToken.cdc"
import monsoonBuyToken from "../../contracts/monsoonBuyToken.cdc"

// This transaction is a template for a transaction
// to add a Vault resource to their account
// so that they can use the monsoonBuyToken

transaction {

    prepare(signer: AuthAccount) {

        if signer.borrow<&monsoonBuyToken.Vault>(from: monsoonBuyToken.VaultStoragePath) == nil {
            // Create a new monsoonBuyToken Vault and put it in storage
            signer.save(<-monsoonBuyToken.createEmptyVault(), to: monsoonBuyToken.VaultStoragePath)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            signer.link<&monsoonBuyToken.Vault{FungibleToken.Receiver}>(
                monsoonBuyToken.ReceiverPublicPath,
                target: monsoonBuyToken.VaultStoragePath
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            signer.link<&monsoonBuyToken.Vault{FungibleToken.Balance}>(
                monsoonBuyToken.BalancePublicPath,
                target: monsoonBuyToken.VaultStoragePath
            )
        }
    }
}
