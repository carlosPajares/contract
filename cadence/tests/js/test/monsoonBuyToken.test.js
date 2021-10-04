import path from "path";

import { emulator, init, getAccountAddress, shallPass, shallResolve, shallRevert } from "flow-js-testing";

import { toUFix64, getMonsoonAdminAddress } from "../src/common";
import {
	deploymonsoonBuyToken,
	setupmonsoonBuyTokenOnAccount,
	getmonsoonBuyTokenBalance,
	getmonsoonBuyTokenSupply,
	mintmonsoonBuyToken,
	transfermonsoonBuyToken,
} from "../src/monsoonBuyToken";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("monsoonBuyToken", () => {
	// Instantiate emulator and path to Cadence files
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../../");
		const port = 7001;
		await init(basePath, { port });
		return emulator.start(port, false);
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		return emulator.stop();
	});

	it("shall have initialized supply field correctly", async () => {
		// Deploy contract
		await shallPass(deploymonsoonBuyToken());

		await shallResolve(async () => {
			const supply = await getmonsoonBuyTokenSupply();
			expect(supply).toBe(toUFix64(0));
		});
	});

	it("shall be able to create empty Vault that doesn't affect supply", async () => {
		// Setup
		await deploymonsoonBuyToken();
		const Alice = await getAccountAddress("Alice");
		await shallPass(setupmonsoonBuyTokenOnAccount(Alice));

		await shallResolve(async () => {
			const supply = await getmonsoonBuyTokenSupply();
			const aliceBalance = await getmonsoonBuyTokenBalance(Alice);
			expect(supply).toBe(toUFix64(0));
			expect(aliceBalance).toBe(toUFix64(0));
		});
	});

	it("shall not be able to mint zero tokens", async () => {
		// Setup
		await deploymonsoonBuyToken();
		const Alice = await getAccountAddress("Alice");
		await setupmonsoonBuyTokenOnAccount(Alice);

		// Mint instruction with amount equal to 0 shall be reverted
		await shallRevert(mintmonsoonBuyToken(Alice, toUFix64(0)));
	});

	it("shall mint tokens, deposit, and update balance and total supply", async () => {
		// Setup
		await deploymonsoonBuyToken();
		const Alice = await getAccountAddress("Alice");
		await setupmonsoonBuyTokenOnAccount(Alice);
		const amount = toUFix64(50);

		// Mint monsoonBuyToken tokens for Alice
		await shallPass(mintmonsoonBuyToken(Alice, amount));

		// Check monsoonBuyToken total supply and Alice's balance
		await shallResolve(async () => {
			// Check Alice balance to equal amount
			const balance = await getmonsoonBuyTokenBalance(Alice);
			expect(balance).toBe(amount);

			// Check monsoonBuyToken supply to equal amount
			const supply = await getmonsoonBuyTokenSupply();
			expect(supply).toBe(amount);
		});
	});

	it("shall not be able to withdraw more than the balance of the Vault", async () => {
		// Setup
		await deploymonsoonBuyToken();
		const MonsoonAdmin = await getMonsoonAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupmonsoonBuyTokenOnAccount(MonsoonAdmin);
		await setupmonsoonBuyTokenOnAccount(Alice);

		// Set amounts
		const amount = toUFix64(1000);
		const overflowAmount = toUFix64(30000);

		// Mint instruction shall resolve
		await shallResolve(mintmonsoonBuyToken(MonsoonAdmin, amount));

		// Transaction shall revert
		await shallRevert(transfermonsoonBuyToken(MonsoonAdmin, Alice, overflowAmount));

		// Balances shall be intact
		await shallResolve(async () => {
			const aliceBalance = await getmonsoonBuyTokenBalance(Alice);
			expect(aliceBalance).toBe(toUFix64(0));

			const MonsoonAdminBalance = await getmonsoonBuyTokenBalance(MonsoonAdmin);
			expect(MonsoonAdminBalance).toBe(amount);
		});
	});

	it("shall be able to withdraw and deposit tokens from a Vault", async () => {
		await deploymonsoonBuyToken();
		const MonsoonAdmin = await getMonsoonAdminAddress();
		const Alice = await getAccountAddress("Alice");
		await setupmonsoonBuyTokenOnAccount(MonsoonAdmin);
		await setupmonsoonBuyTokenOnAccount(Alice);
		await mintmonsoonBuyToken(MonsoonAdmin, toUFix64(1000));

		await shallPass(transfermonsoonBuyToken(MonsoonAdmin, Alice, toUFix64(300)));

		await shallResolve(async () => {
			// Balances shall be updated
			const MonsoonAdminBalance = await getmonsoonBuyTokenBalance(MonsoonAdmin);
			expect(MonsoonAdminBalance).toBe(toUFix64(700));

			const aliceBalance = await getmonsoonBuyTokenBalance(Alice);
			expect(aliceBalance).toBe(toUFix64(300));

			const supply = await getmonsoonBuyTokenSupply();
			expect(supply).toBe(toUFix64(1000));
		});
	});
});
