import path from "path";

import { emulator, init, getAccountAddress, shallPass } from "flow-js-testing";

import { toUFix64 } from "../src/common";
import { mintmonsoonBuyToken } from "../src/monsoonBuyToken";
import { mintFUSD } from "../src/fusd";
import { getmonsoonCardCount, mintmonsoonCard, getmonsoonCard, cardData1, changeAddressCut } from "../src/monsoon";
import {
	deployNFTStorefront,
	buyItemMonsoonBuyToken,
	buyItemFUSD,	
	removeItem,
	setupStorefrontOnAccount,
	getSaleOfferCount,
	sellItemMonsoonBuyToken,
	sellItemFUSD 
} from "../src/nft-storefront";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("NFT Storefront", () => {
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../../");
		const port = 7003;
		await init(basePath, { port });
		return emulator.start(port, false);
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		return emulator.stop();
	});

	it("shall deploy NFTStorefront contract", async () => {
		await shallPass(deployNFTStorefront());
	});

	it("shall be able to create an empty Storefront", async () => {
		// Setup
		await deployNFTStorefront();
		const Alice = await getAccountAddress("Alice");

		await shallPass(setupStorefrontOnAccount(Alice));
	});
	
	it("shall be able to create a sale offer in monsoonTokens", async () => {
		// Setup
		await deployNFTStorefront();

		// Set the address in the contract for reciver de cut percentage of the sales
		const Comisionist = await getAccountAddress("Comisionist");
		await setupStorefrontOnAccount(Comisionist);
		await changeAddressCut(Comisionist);



		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);
				
		// Mint monsoonCard for Alice's account
		await shallPass(mintmonsoonCard(cardData1, Alice));
		
		const itemID = 0;

		await shallPass(sellItemMonsoonBuyToken(Alice, itemID, toUFix64(1.11)));
	});

	it("shall be able to create a sale offer in fusd", async () => {
		// Setup
		await deployNFTStorefront();

		// Set the address in the contract for reciver de cut percentage of the sales
		const Comisionist = await getAccountAddress("Comisionist");
		await setupStorefrontOnAccount(Comisionist);
		await changeAddressCut(Comisionist);

		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);
				
		// Mint monsoonCard for Alice's account
		await shallPass(mintmonsoonCard(cardData1, Alice));
		
		const itemID = 0;

		await shallPass(sellItemFUSD(Alice, itemID, toUFix64(1.11)));


	});


	it("shall be able to accept a sale offer in monsoonBuyTokens", async () => {
		// Setup
		await deployNFTStorefront();

		// Setup seller account
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);
		await mintmonsoonCard(cardData1, Alice);

		// Set the address in the contract for reciver de cut percentage of the sales
		const Comisionist = await getAccountAddress("Comisionist");
		await setupStorefrontOnAccount(Comisionist);
		await changeAddressCut(Comisionist);

		const itemId = 0;

		// Setup buyer account
		const Bob = await getAccountAddress("Bob");
		await setupStorefrontOnAccount(Bob);

		await shallPass(mintmonsoonBuyToken(Bob, toUFix64(100)));

		// Bob shall be able to buy from Alice
		const sellItemTransactionResult = await shallPass(sellItemMonsoonBuyToken(Alice, itemId, toUFix64(1.11)));

		const saleOfferAvailableEvent = sellItemTransactionResult.events[0];
		const saleOfferResourceID = saleOfferAvailableEvent.data.saleOfferResourceID;

		await shallPass(buyItemMonsoonBuyToken(Bob, saleOfferResourceID, Alice));

		const itemCount = await getmonsoonCardCount(Bob);
		expect(itemCount).toBe(1);

		const offerCount = await getSaleOfferCount(Alice);
		expect(offerCount).toBe(0);
	});

	it("shall be able to accept a sale offer in FUSD", async () => {
		// Setup
		await deployNFTStorefront();

		// Setup seller account
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);
		await mintmonsoonCard(cardData1, Alice);

		// Set the address in the contract for reciver de cut percentage of the sales
		const Comisionist = await getAccountAddress("Comisionist");
		await setupStorefrontOnAccount(Comisionist);
		await changeAddressCut(Comisionist);

		const itemId = 0;

		// Setup buyer account
		const Bob = await getAccountAddress("Bob");
		await setupStorefrontOnAccount(Bob);

		await shallPass(mintFUSD(Bob, toUFix64(100)));

		// Bob shall be able to buy from Alice
		const sellItemTransactionResult = await shallPass(sellItemFUSD(Alice, itemId, toUFix64(1.11)));

		const saleOfferAvailableEvent = sellItemTransactionResult.events[0];
		const saleOfferResourceID = saleOfferAvailableEvent.data.saleOfferResourceID;

		await shallPass(buyItemFUSD(Bob, saleOfferResourceID, Alice));

		const itemCount = await getmonsoonCardCount(Bob);
		expect(itemCount).toBe(1);

		const offerCount = await getSaleOfferCount(Alice);
		expect(offerCount).toBe(0);
	});


	it("shall be able to remove a sale offer in monsoonBuyTokens", async () => {
		// Deploy contracts
		await shallPass(deployNFTStorefront());

		// Setup Alice account
		const Alice = await getAccountAddress("Alice");
		await shallPass(setupStorefrontOnAccount(Alice));

		// Mint instruction shall pass
		await shallPass(mintmonsoonCard(cardData1, Alice));

		// Set the address in the contract for reciver de cut percentage of the sales
		const Comisionist = await getAccountAddress("Comisionist");
		await setupStorefrontOnAccount(Comisionist);
		await changeAddressCut(Comisionist);



		const itemId = 0;

		const item = await getmonsoonCard(Alice, itemId);

		// Listing item for sale shall pass
		const sellItemTransactionResult = await shallPass(sellItemMonsoonBuyToken(Alice, itemId, toUFix64(1.11)));

		const saleOfferAvailableEvent = sellItemTransactionResult.events[0];
		const saleOfferResourceID = saleOfferAvailableEvent.data.saleOfferResourceID;

		// Alice shall be able to remove item from sale
		await shallPass(removeItem(Alice, saleOfferResourceID));

		const offerCount = await getSaleOfferCount(Alice);
		expect(offerCount).toBe(0);
	});

	it("shall be able to remove a sale offer in FUSD", async () => {
		// Deploy contracts
		await shallPass(deployNFTStorefront());

		// Setup Alice account
		const Alice = await getAccountAddress("Alice");
		await shallPass(setupStorefrontOnAccount(Alice));

		// Mint instruction shall pass
		await shallPass(mintmonsoonCard(cardData1, Alice));

		// Set the address in the contract for reciver de cut percentage of the sales
		const Comisionist = await getAccountAddress("Comisionist");
		await setupStorefrontOnAccount(Comisionist);
		await changeAddressCut(Comisionist);



		const itemId = 0;

		const item = await getmonsoonCard(Alice, itemId);

		// Listing item for sale shall pass
		const sellItemTransactionResult = await shallPass(sellItemFUSD(Alice, itemId, toUFix64(1.11)));

		const saleOfferAvailableEvent = sellItemTransactionResult.events[0];
		const saleOfferResourceID = saleOfferAvailableEvent.data.saleOfferResourceID;

		// Alice shall be able to remove item from sale
		await shallPass(removeItem(Alice, saleOfferResourceID));

		const offerCount = await getSaleOfferCount(Alice);
		expect(offerCount).toBe(0);
	});	
});
