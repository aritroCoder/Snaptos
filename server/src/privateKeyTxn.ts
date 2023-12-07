import { Account,Aptos,Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

  type Request = {
    pk: string;
    recipient: string;
    amount: number;
  }
  



export async function privateKeyTxn(request:Request) {

    const aptos = new Aptos();

    const requestBody: Request = request;
    const { recipient, pk, amount } = requestBody;
  
    // const pk = "0x4be5a633898eb5040519eab1494309f6966d977613d25500784b034a41f377a4";
    const privateKey = new Ed25519PrivateKey(pk);
    const account = Account.fromPrivateKey({ privateKey: privateKey });

    const txn = await aptos.transferCoinTransaction({
      sender: account,
      recipient: recipient,
      amount: amount,
    });
    const txn1 = await aptos.signAndSubmitTransaction({ signer: account, transaction: txn });
    console.log(txn1);
    return txn1;

}

