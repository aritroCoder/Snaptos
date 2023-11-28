import { AccountAddress, Aptos } from '@aptos-labs/ts-sdk';

type Request = {
  address: AccountAddress;
  amt: number;
};

/**
 * Create an account on the APTOS protocol.
 * @param request The request body.
 * @returns The transaction hash and account accountAddress.
 * @throws {Error} If the account could not be created.
 */
export async function createAccount(request: Request) {
  const aptos = new Aptos();

  const requestBody: Request = request;

  console.log('this is request body', requestBody);
  console.log(typeof requestBody.address);

  const dataArray: Uint8Array = new Uint8Array(
    Object.values(requestBody.address.data),
  );

  console.log(dataArray);

  const txn = await aptos.fundAccount({
    accountAddress: dataArray,
    amount: requestBody.amt,
    options: {
      indexerVersionCheck: false,
    },
  });
  console.log('this is txn', txn, typeof txn);

  return txn;
}
