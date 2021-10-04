import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import monsoonBuyToken from "../../contracts/monsoonBuyToken.cdc"
import Monsoon from "../../contracts/Monsoon.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"

transaction(saleOfferResourceID: UInt64, storefrontAddress: Address) {

    let paymentVault: @FungibleToken.Vault
    let monsoonCollection: &Monsoon.Collection{NonFungibleToken.Receiver}
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}
    let saleOffer: &NFTStorefront.SaleOffer{NFTStorefront.SaleOfferPublic}

    prepare(account: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
                NFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Cannot borrow Storefront from provided address")

        self.saleOffer = self.storefront.borrowSaleOffer(saleOfferResourceID: saleOfferResourceID)
            ?? panic("No offer with that ID in Storefront")
        
        let price = self.saleOffer.getDetails().salePrice

        let mainmonsoonBuyTokenVault = account.borrow<&monsoonBuyToken.Vault>(from: monsoonBuyToken.VaultStoragePath)
            ?? panic("Cannot borrow monsoonBuyToken vault from account storage")
        
        self.paymentVault <- mainmonsoonBuyTokenVault.withdraw(amount: price)

        self.monsoonCollection = account.borrow<&Monsoon.Collection{NonFungibleToken.Receiver}>(
            from: Monsoon.CollectionStoragePath
        ) ?? panic("Cannot borrow Monsoon collection receiver from account")
    }

    execute {
        let item <- self.saleOffer.accept(
            payment: <-self.paymentVault
        )

        self.monsoonCollection.deposit(token: <-item)

        self.storefront.cleanup(saleOfferResourceID: saleOfferResourceID)
    }
}
