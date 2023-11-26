import { Account, Aptos, AccountAddressInput, AnyNumber } from "@aptos-labs/ts-sdk";

interface Request {
    sender: Account;
    recipient: string;
    amount: number;
}

export async function doTransaction(request: Request) {
    const aptos = new Aptos();
    const requestBody: Request = request;

    const {sender, recipient, amount} = requestBody;
    console.log(sender);

    try {
        const tran = await aptos.transferCoinTransaction({
            sender,
            recipient,
            amount
        });
        const txn = await aptos.signAndSubmitTransaction({ signer: sender, transaction: tran });
        console.log('Transaction:', txn);
        return txn;
    } catch (error) {
        console.error('Error:', error);
    }
}
