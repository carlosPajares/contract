import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Monsoon from "../../contracts/Monsoon.cdc"


pub fun main(address: Address, itemID: UInt64): {UInt64: Monsoon.CardData}? {
  if let collection = getAccount(address).getCapability<&Monsoon.Collection{NonFungibleToken.CollectionPublic, Monsoon.MonsoonCollectionPublic}>(Monsoon.CollectionPublicPath).borrow() {
    let listCards = collection.listCards() 
    return listCards
    
  }

  return nil
}
