import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Monsoon from "../../contracts/Monsoon.cdc"

pub struct AccountItem {
  pub let itemID: UInt64

  pub let templateID: UInt64  
  pub let typeOfCard: UInt32  
  pub let universeID: UInt32
  pub let numSeries: UInt32  
  pub let numSerial: UInt32
  pub let CID: String

  pub let resourceID: UInt64
  pub let owner: Address



  init(itemID: UInt64, templateID: UInt64, typeOfCard: UInt32, universeID: UInt32, numSeries: UInt32, numSerial: UInt32, CID: String, resourceID: UInt64, owner: Address) {

    self.itemID = itemID
    self.templateID = templateID
    self.typeOfCard = typeOfCard
    self.universeID = universeID
    self.numSeries = numSeries
    self.numSerial = numSerial
    self.CID = CID

    self.resourceID = resourceID
    self.owner = owner

  }
}

pub fun main(address: Address, itemID: UInt64): AccountItem? {
  if let collection = getAccount(address).getCapability<&Monsoon.Collection{NonFungibleToken.CollectionPublic, Monsoon.MonsoonCollectionPublic}>(Monsoon.CollectionPublicPath).borrow() {
    if let item = collection.borrowMonsoonCard(id: itemID) {
      return AccountItem(itemID: itemID, templateID: item.data.templateID, typeOfCard: item.data.typeOfCard, universeID: item.data.universeID, numSeries: item.data.numSeries, numSerial: item.data.numSerial, CID: item.data.CID, resourceID: item.uuid, owner: address)
    }
  }

  return nil
}
