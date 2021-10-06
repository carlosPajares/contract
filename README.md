<p align="center">
    <a href="https://monsoon.digital">
        <img width="400" src="monsoon-nft-banner.png" />
    </a>
</p>

# contract

This are the contracts of the Monsoon NTF Trade Market project under Flow Blockchain network.

We will trade with colective cards of diferent tabletop games.

The diferent tabletop games are condiderated as "Universes"

Each Card (NFT) has the next fields:

      // This is the key of the templateCard
        pub let templateID: UInt64
        // 0 Comun 1 Rare 2 Combination 3 Legendarie
        pub let typeOfCard: UInt32 
        // universe of the card (0 Zombicide 1 .....)
        pub let universeID: UInt32
        // printing number (as an book editon)
        pub let numSeries: UInt32
        // Number of the serie in the card
        pub let numSerial: UInt32
        //File static card in ipfs system
        pub let CID: String

The Cards are negitiated with the NFTStorefront.cdc contract and the one of the token to trade is monsoonBuyToken a standard contract of fungible tokens.
