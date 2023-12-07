import { Aptos, TransactionResponse } from "@aptos-labs/ts-sdk";

type Request = {
    address: string;
}

export async function getTxn(request:Request) {

    const aptos = new Aptos();
    const txnHistory : TransactionResponse[] = await aptos.getAccountTransactions({accountAddress: request.address});
    console.log('this is txnHis', txnHistory);

    return txnHistory;
    
}