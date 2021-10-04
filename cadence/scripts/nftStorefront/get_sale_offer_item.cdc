import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import NFTStorefront from "../../contracts/NFTStorefront.cdc"
import Monsoon from "../../contracts/Monsoon.cdc"

pub struct SaleItem {
    pub let itemID: UInt64

    pub let templateID: UInt64
    pub let typeOfCard: UInt32 
    pub let universeID: UInt32
    pub let numSeries: UInt32
    pub let numSerial: UInt32    
    pub let CID: String

    pub let owner: Address
    pub let price: UFix64

    init(itemID: UInt64, templateID: UInt64, typeOfCard: UInt32, universeID: UInt32, numSeries: UInt32, numSerial: UInt32, CID: String, owner: Address, price: UFix64) {
        self.itemID = itemID

        self.templateID = templateID
        self.typeOfCard = typeOfCard
        self.universeID = universeID
        self.numSeries = numSeries
        self.numSerial = numSerial
        self.CID = CID


        self.owner = owner
        self.price = price
    }
}

pub fun main(address: Address, saleOfferResourceID: UInt64): SaleItem? {
    let account = getAccount(address)

    if let storefrontRef = account.getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath).borrow() {
        if let saleOffer = storefrontRef.borrowSaleOffer(saleOfferResourceID: saleOfferResourceID) {
            let details = saleOffer.getDetails()

            let itemID = details.nftID
            let itemPrice = details.salePrice

            if let collection = account.getCapability<&Monsoon.Collection{NonFungibleToken.CollectionPublic, Monsoon.MonsoonCollectionPublic}>(Monsoon.CollectionPublicPath).borrow() {
                if let item = collection.borrowMonsoonCard(id: itemID) {
                    return SaleItem(itemID: itemID, templateID: item.data.templateID, typeOfCard: item.data.typeOfCard, universeID: item.data.universeID, numSeries: item.data.numSeries, numSerial: item.data.numSerial, CID: item.data.CID, owner: address, price: itemPrice)
                }
            }
        }
    }
        
    return nil
}
