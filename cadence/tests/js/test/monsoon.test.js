import path from "path";

import { emulator, init, getAccountAddress, shallPass, shallResolve, shallRevert } from "flow-js-testing";

import { getMonsoonAdminAddress } from "../src/common";
import {
	deployMonsoon,
	getmonsoonCard,
	getmonsoonCardCount,
	getmonsoonCardSupply,
	mintmonsoonCard,
	setupMonsoonOnAccount,
	transfermonsoonCard,
	cardData1,
	cardData2,
	deleteBatch,
	getmonsoonTotalBurned,
} from "../src/monsoon";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(50000);

describe("monsoon", () => {
	// Instantiate emulator and path to Cadence files
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../../");
		const port = 7002;
		await init(basePath, { port });
		return emulator.start(port, false);
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		return emulator.stop();
	});

	it("shall deploy Monsoon contract", async () => {
		await deployMonsoon();
	});

	it("supply shall be 0 after contract is deployed", async () => {
		// Setup
		await deployMonsoon();
		const MonsoonAdmin = await getMonsoonAdminAddress();
		await shallPass(setupMonsoonOnAccount(MonsoonAdmin));

		await shallResolve(async () => {
			const supply = await getmonsoonCardSupply();
			expect(supply).toBe(0);
		});
	});

	it("shall be able to mint a monsoon", async () => {
		// Setup
		await deployMonsoon();
		const Alice = await getAccountAddress("Alice");
		await setupMonsoonOnAccount(Alice);
		const itemCardToMint = cardData1;

		// Mint instruction for Alice account shall be resolved
		await shallPass(mintmonsoonCard(itemCardToMint, Alice));
	});

	it("shall be able to create a new empty NFT Collection", async () => {
		// Setup
		await deployMonsoon();
		const Alice = await getAccountAddress("Alice");
		await setupMonsoonOnAccount(Alice);

		// shall be able te read Alice collection and ensure it's empty
		await shallResolve(async () => {
			const itemCount = await getmonsoonCardCount(Alice);
			expect(itemCount).toBe(0);
		});
	});

	it("shall not be able to withdraw an NFT that doesn't exist in a collection", async () => {
		// Setup
		await deployMonsoon();
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await setupMonsoonOnAccount(Alice);
		await setupMonsoonOnAccount(Bob);

		// Transfer transaction shall fail for non-existent item
		await shallRevert(transfermonsoonCard(Alice, Bob, 1337));
	});

	it("shall be able to withdraw an NFT and deposit to another accounts collection", async () => {
		await deployMonsoon();
		const Alice = await getAccountAddress("Alice");
		const Bob = await getAccountAddress("Bob");
		await setupMonsoonOnAccount(Alice);
		await setupMonsoonOnAccount(Bob);

		// Mint instruction for Alice account shall be resolved
		await shallPass(mintmonsoonCard(cardData1, Alice));

		// Transfer transaction shall pass
		await shallPass(transfermonsoonCard(Alice, Bob, 0));
	});

	it("shall be able to delete an set of cards", async () => {
		await deployMonsoon();
		const Alice = await getAccountAddress("Alice");
		await setupMonsoonOnAccount(Alice);


		// Mint instruction for Alice account shall be resolved
		await shallPass(mintmonsoonCard(cardData1, Alice));

		// Mint other instruction for Alice account shall be resolved 
		await shallPass(mintmonsoonCard(cardData2, Alice));

		// Now Alice should have two cards
		const itemCount = await getmonsoonCardCount(Alice);
		expect(itemCount).toBe(2);

		// Delete the two cards minted
		await shallPass(deleteBatch([0, 1], Alice));

		const itemCountAfter = await getmonsoonCardCount(Alice);
		expect(itemCountAfter).toBe(0);

		await shallResolve(async () => {
			const burned = await getmonsoonTotalBurned();
			expect(burned).toBe(2);
		});		



	});	
});
