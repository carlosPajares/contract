import { deployContractByName, executeScript, mintFlow, sendTransaction } from "flow-js-testing";
import { getMonsoonAdminAddress } from "./common";

/*
 * Deploys monsoonBuyToken contract to MonsoonAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deploymonsoonBuyToken = async () => {
	const MonsoonAdmin = await getMonsoonAdminAddress();
	await mintFlow(MonsoonAdmin, "10.0");

	return deployContractByName({ to: MonsoonAdmin, name: "monsoonBuyToken" });
};

/*
 * Setups monsoonBuyToken Vault on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupmonsoonBuyTokenOnAccount = async (account) => {
	const name = "monsoonBuyToken/setup_account";
	const signers = [account];

	return sendTransaction({ name, signers });
};

/*
 * Returns monsoonBuyToken balance for **account**.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 * */
export const getmonsoonBuyTokenBalance = async (account) => {
	const name = "monsoonBuyToken/get_balance";
	const args = [account];

	return executeScript({ name, args });
};

/*
 * Returns monsoonBuyToken supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UFix64}
 * */
export const getmonsoonBuyTokenSupply = async () => {
	const name = "monsoonBuyToken/get_supply";
	return executeScript({ name });
};

/*
 * Mints **amount** of monsoonBuyToken tokens and transfers them to recipient.
 * @param {string} recipient - recipient address
 * @param {string} amount - UFix64 amount to mint
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const mintmonsoonBuyToken = async (recipient, amount) => {
	const MonsoonAdmin = await getMonsoonAdminAddress();

	const name = "monsoonBuyToken/mint_tokens";
	const args = [recipient, amount];
	const signers = [MonsoonAdmin];

	return sendTransaction({ name, args, signers });
};

/*
 * Transfers **amount** of monsoonBuyToken tokens from **sender** account to **recipient**.
 * @param {string} sender - sender address
 * @param {string} recipient - recipient address
 * @param {string} amount - UFix64 amount to transfer
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const transfermonsoonBuyToken = async (sender, recipient, amount) => {
	const name = "monsoonBuyToken/transfer_tokens";
	const args = [amount, recipient];
	const signers = [sender];

	return sendTransaction({ name, args, signers });
};
