import { AccountAddress, Aptos } from '@aptos-labs/ts-sdk';

type Request = {
    hash: string;
};

export async function getTransByHash(request: Request) {
    const aptos = new Aptos();
    const requestBody: Request = request;

    const txn = await aptos.getTransactionByHash({transactionHash: requestBody.hash});
    console.log('this is txn', txn);

    return txn; 
}