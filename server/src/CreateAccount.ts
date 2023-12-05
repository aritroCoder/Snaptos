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
  console.log("yes")
  const aptos = new Aptos();

  const requestBody: Request = request;

  console.log('this is request body', requestBody);
  console.log(typeof requestBody.address);

  const txn = await aptos.fundAccount({
    accountAddress: requestBody.address,
    amount: requestBody.amt,
    options: {
      indexerVersionCheck: false,
    },
  });
  console.log('this is txn', txn, typeof txn);

  return txn;
}
