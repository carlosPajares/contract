import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Monsoon from "../../contracts/Monsoon.cdc"

// This transaction configures an account to hold monsoon.

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&Monsoon.Collection>(from: Monsoon.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- Monsoon.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: Monsoon.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&Monsoon.Collection{NonFungibleToken.CollectionPublic, Monsoon.MonsoonCollectionPublic}>(Monsoon.CollectionPublicPath, target: Monsoon.CollectionStoragePath)
        }
    }
}
