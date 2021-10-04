import { deployContractByName, executeScript, mintFlow, sendTransaction } from "flow-js-testing";

import { getMonsoonAdminAddress } from "./common";



// Monsoon types


export const cardData1 = {
	"templateID": 145,
	"typeOfCard": 0,
	"universeID": 1,
	"numSeries": 1,
	"numSerial": 256,
	"CID": "QmexfmCQu46mPVJ9rX3rKdsgMAR3W4TZ5NC8G7ZqF9UdVE"
}

export const cardData2 = {
	"templateID": 12,
	"typeOfCard": 2,
	"universeID": 1,
	"numSeries": 2,
	"numSerial": 28,
	"CID": "QmVMsy8VdzM8zQCd1uLHEQ1M81PxpE4huwDHbTVCHiJYC9"
}



/*
 * Deploys NonFungibleToken and Monsoon contracts to MonsoonAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const deployMonsoon = async () => {
	const MonsoonAdmin = await getMonsoonAdminAddress();
	await mintFlow(MonsoonAdmin, "10.0");

	await deployContractByName({ to: MonsoonAdmin, name: "NonFungibleToken" });

	const addressMap = { NonFungibleToken: MonsoonAdmin };
	return deployContractByName({ to: MonsoonAdmin, name: "Monsoon", addressMap });
};

/*
 * Setups Monsoon collection on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<*>}
 * */
export const setupMonsoonOnAccount = async (account) => {
	const name = "monsoon/setup_account";
	const signers = [account];

	return sendTransaction({ name, signers });
};

/*
 * Returns Monsoon supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64} - number of NFT minted so far
 * */
export const getmonsoonCardSupply = async () => {
	const name = "monsoon/get_monsoon_supply";

	return executeScript({ name });
};

/*
 * Returns Monsoon Total Burned.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64} - number of NFT minted so far
 * */
export const getmonsoonTotalBurned = async () => {
	const name = "monsoon/get_monsoon_total_burned";

	return executeScript({ name });
};


/*
 * Change the address of the cutPercentage reciver to **recipient**.
 * @param {string} recipient - recipient account address
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const changeAddressCut = async (recipient) => {
	const MonsoonAdmin = await getMonsoonAdminAddress();

	const name = "monsoon/set_addressReciverCutPercentage";	
	const args = [recipient];
	const signers = [MonsoonAdmin];

	return sendTransaction({ name, args, signers });
};




/*
 * Mints monsoonCard of a specific **itemType** and sends it to **recipient**.
 * @param Monsoon.CardData struct - type of NFT to mint
 * @param {string} recipient - recipient account address
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const mintmonsoonCard = async (cardData, recipient) => {
	const MonsoonAdmin = await getMonsoonAdminAddress();

	const name = "monsoon/mint_monsoon_card";
	console.log("parameters:" + recipient + " " + cardData.templateID.toString() + " " + cardData.typeOfCard.toString() + " " + cardData.universeID.toString() + " " + cardData.numSeries.toString() + " " + cardData.numSerial.toString() + " " + cardData.CID);
	const args = [recipient, cardData.templateID, cardData.typeOfCard, cardData.universeID, cardData.numSeries, cardData.numSerial, cardData.CID];
	//const args = [recipient, toUInt64(5), 0, 1, 2, 536, "QmexfmCQu46mPVJ9rX3rKdsgMAR3W4TZ5NC8G7ZqF9UdVE"];
	const signers = [MonsoonAdmin];

	return sendTransaction({ name, args, signers });
};



/*
 * Transfers monsoonCard NFT with id equal **itemCard** from **sender** account to **recipient**.
 * @param {string} sender - sender address
 * @param {string} recipient - recipient address
 * @param {UInt64} itemId - id of the item to transfer
 * @throws Will throw an error if execution will be halted
 * @returns {Promise<*>}
 * */
export const transfermonsoonCard = async (sender, recipient, itemId) => {
	const name = "monsoon/transfer_monsoon_card";
	const args = [recipient, itemId];
	const signers = [sender];

	return sendTransaction({ name, args, signers });
};

/*
 * Returns the monsoonCard NFT with the provided **id** from an account collection.
 * @param {string} account - account address
 * @param {UInt64} itemID - NFT id
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getmonsoonCard = async (account, itemID) => {
	const name = "monsoon/get_monsoon_card";
	const args = [account, itemID];

	return executeScript({ name, args });
};

/*
 * Returns the number of monsoon in an account's collection.
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const getmonsoonCardCount = async (account) => {
	const name = "monsoon/get_collection_length";
	const args = [account];

	return executeScript({ name, args });
};


/*
 * Delete a set of Cards for the fusion cards process
 * @param [UInt64] keys of the cards to delete
 * @param {string} account - account address
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64}
 * */
export const deleteBatch = async (keys, account) => {
	const name = "monsoon/delete_batch_cards";
	const args = [keys];

	const signers = [account];

	return sendTransaction({ name, args, signers });
};