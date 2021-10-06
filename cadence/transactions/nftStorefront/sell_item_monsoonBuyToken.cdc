import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import monsoonBuyToken from "../../contracts/monsoonBuyToken.cdc"
import Monsoon from "../../contracts/Monsoon.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let monsoonBuyTokenReceiver: Capability<&monsoonBuyToken.Vault{FungibleToken.Receiver}>
    let monsoonBuyTokenReceiverCommision: Capability<&monsoonBuyToken.Vault{FungibleToken.Receiver}>
    let monsoonProvider: Capability<&Monsoon.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(account: AuthAccount) {
        // We need a provider capability, but one is not provided by default so we create one if needed.
        let monsoonCollectionProviderPrivatePath = /private/monsoonCollectionProvider

        self.monsoonBuyTokenReceiver = account.getCapability<&monsoonBuyToken.Vault{FungibleToken.Receiver}>(monsoonBuyToken.ReceiverPublicPath)!
        
        assert(self.monsoonBuyTokenReceiver.borrow() != nil, message: "Missing or mis-typed monsoonBuyToken receiver")

        self.monsoonBuyTokenReceiverCommision = getAccount(Monsoon.addressReceivermonsoonCutPercentage).getCapability<&monsoonBuyToken.Vault{FungibleToken.Receiver}>(monsoonBuyToken.ReceiverPublicPath)!
        
        assert(self.monsoonBuyTokenReceiverCommision.borrow() != nil, message: "Missing or mis-typed monsoonBuyToken receiver  commisionist")


        if !account.getCapability<&Monsoon.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(monsoonCollectionProviderPrivatePath)!.check() {
            account.link<&Monsoon.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(monsoonCollectionProviderPrivatePath, target: Monsoon.CollectionStoragePath)
        }

        self.monsoonProvider = account.getCapability<&Monsoon.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(monsoonCollectionProviderPrivatePath)!
        assert(self.monsoonProvider.borrow() != nil, message: "Missing or mis-typed Monsoon.Collection provider")

        self.storefront = account.borrow<&NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
        let saleCut = NFTStorefront.SaleCut(
            receiver: self.monsoonBuyTokenReceiver,
            amount: saleItemPrice
        )

        let saleCutCommission = NFTStorefront.SaleCut(
            receiver: self.monsoonBuyTokenReceiverCommision,
            amount: saleItemPrice * Monsoon.monsoonCutPercentage
        )


        self.storefront.createSaleOffer(
            nftProviderCapability: self.monsoonProvider,
            nftType: Type<@Monsoon.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@monsoonBuyToken.Vault>(),
            saleCuts: [saleCut, saleCutCommission]
        )
    }
}
