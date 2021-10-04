import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Monsoon from "../../contracts/Monsoon.cdc"

// This transaction transfers a Monsoon Card from one account to another.


transaction(keys: [UInt64]) {

    let collectionRef: &Monsoon.Collection

    prepare(signer: AuthAccount) {
        
        // borrow a reference to the signer's NFT collection
        self.collectionRef = signer.borrow<&Monsoon.Collection>(from: Monsoon.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

    }
    execute {
        self.collectionRef.batchDestroy(keys: keys)
    }

}