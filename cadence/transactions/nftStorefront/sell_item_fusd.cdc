import FungibleToken from "../../contracts/FungibleToken.cdc"
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import FUSD from "../../contracts/FUSD.cdc"
import Monsoon from "../../contracts/Monsoon.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let fusdReceiver: Capability<&FUSD.Vault{FungibleToken.Receiver}>
    let fusdReceiverCommission: Capability<&FUSD.Vault{FungibleToken.Receiver}>
    let monsoonProvider: Capability<&Monsoon.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &NFTStorefront.Storefront

    prepare(account: AuthAccount) {
        // We need a provider capability, but one is not provided by default so we create one if needed.
        let monsoonCollectionProviderPrivatePath = /private/monsoonCollectionProvider

        self.fusdReceiver = account.getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)!
        
        assert(self.fusdReceiver.borrow() != nil, message: "Missing or mis-typed FUSD receiver")

        self.fusdReceiverCommission = getAccount(Monsoon.addressRecivermonsoonCutPercentage).getCapability<&FUSD.Vault{FungibleToken.Receiver}>(/public/fusdReceiver)!
        
        assert(self.fusdReceiverCommission.borrow() != nil, message: "Missing or mis-typed FUSD receiver commissionist")


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
            receiver: self.fusdReceiver,
            amount: saleItemPrice
        )

        let saleCutCommission = NFTStorefront.SaleCut(
            receiver: self.fusdReceiverCommission,
            amount: saleItemPrice * Monsoon.monsoonCutPercentage
        )


        self.storefront.createSaleOffer(
            nftProviderCapability: self.monsoonProvider,
            nftType: Type<@Monsoon.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@FUSD.Vault>(),
            saleCuts: [saleCut, saleCutCommission]
        )
    }
}
