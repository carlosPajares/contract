import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import Monsoon from "../../contracts/Monsoon.cdc"

// This transction uses the NFTMinter resource to set the comisionist of the market.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(recipient: Address) {
    
    // local variable for storing the minter reference
    let minter: &Monsoon.NFTMinter

    prepare(signer: AuthAccount) {

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&Monsoon.NFTMinter>(from: Monsoon.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        self.minter.changeaddressRecivermonsoonCutPercentage(newReciver: recipient)
    }
}
