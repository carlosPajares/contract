transaction(flowKey: String) {

  prepare(acct: AuthAccount) {
    let newAccount = AuthAccount(payer: acct)
    newAccount.addPublicKey(flowKey.decodeHex())
  }

}
