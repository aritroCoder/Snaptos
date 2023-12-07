import { AccountAddress, Aptos } from '@aptos-labs/ts-sdk';

type Request = {
    address: string;
  };

export async function fundMe(request: Request) {
    const aptos = new Aptos();

    const requestBody: Request = request;

    console.log('this is request body', requestBody);
    console.log(typeof requestBody.address);

    const txn = await aptos.fundAccount({
        accountAddress: requestBody.address,
        amount: 100000000,
        options: {
        indexerVersionCheck: false,
        },
    });
    console.log('this is txn', txn, typeof txn);

    return txn;
}
