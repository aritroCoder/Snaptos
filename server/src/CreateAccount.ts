import { Aptos } from "@aptos-labs/ts-sdk";

interface Request {
    address: string;
    amt: number;
}

export async function createAccount(request: Request) {
    const aptos = new Aptos();

    const requestBody: Request = request; 

    const txn = await aptos.fundAccount({accountAddress: requestBody.address, amount: requestBody.amt});
    console.log('this is txn', txn);

    return txn;
    
}