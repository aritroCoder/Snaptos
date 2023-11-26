import { GetAccountCoinsDataResponse, Aptos } from "@aptos-labs/ts-sdk";

interface Request {
    address: string;
}

export default async function checkBalance(request:Request) {

    const aptos = new Aptos();
    const accountCoinsData: GetAccountCoinsDataResponse = await aptos.getAccountCoinsData({accountAddress: request.address});
    console.log('this is accountCoinsData', accountCoinsData);

    return accountCoinsData;
    
}