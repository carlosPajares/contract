import { deployContractByName, executeScript, mintFlow, sendTransaction } from "flow-js-testing";
import { getMonsoonAdminAddress } from "./common";

/*
 * Deploys fusd contract to MonsoonAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployFusd = async () => {
	const MonsoonAdmin = await getMonsoonAdminAddress();
	await mintFlow(MonsoonAdmin, "10.0");

	return deployContractByName({ to: MonsoonAdmin, name: "FUSD" });
};

/*
 * Setups fusd Vault on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupFusdOnAccount = async (account) => {
	const name = "fusd/setup_account";
	const signers = [account];

	return sendTransaction({ name, signers });
};


/*
 * Mints **amount** of FUSD tokens and transfers them to recipient.
 * @param {string} recipient - recipient address
 * @param {string} amount - UFix64 amount to mint
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const mintFUSD = async (recipient, amount) => {
	const MonsoonAdmin = await getMonsoonAdminAddress();

	const name = "fusd/mint_tokens";
	const args = [recipient, amount];
	const signers = [MonsoonAdmin];

	return sendTransaction({ name, args, signers });
};
