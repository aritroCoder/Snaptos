import getAccount from './GetAccount';

const HOST = 'http://localhost:5500';

/**
 * Transfer coins to another account.
 * @param to - recipient address.
 * @param amount - amount of coins to transfer.
 * @returns transaction hash.
 */
export default async function signTxn(to: string, amount: number) {
  const account = await getAccount();
  const txHash = await fetch(`${HOST}/doTransaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sender: account, recipient: to, amount }),
  });
  return txHash;
}
