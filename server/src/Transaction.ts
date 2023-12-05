import { Account, Aptos } from '@aptos-labs/ts-sdk';

type Request = {
  sender: Account;
  recipient: string;
  amount: number;
};

/**
 * Submit a transaction to the blockchain.
 *
 * @param request - request body.
 * @returns { txn } - transaction hash.
 */
export async function doTransaction(request: Request) {
  const aptos = new Aptos();
  const requestBody: Request = request;

  const { sender, recipient, amount } = requestBody;

  try {
    console.log({ sender, recipient, amount });
    const txn = await aptos.transferCoinTransaction({
      sender,
      recipient,
      amount,
    });
    console.log('Transaction:', txn);
    return txn;
  } catch (error) {
    console.error('Error:', error);
  }
}
