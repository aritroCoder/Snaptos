import getAccount from './GetAccount';

const HOST = 'http://localhost:5500';

/**
 * Transfer coins to another account.
 * @param to - recipient address.
 * @param amount - amount of coins to transfer.
 * @returns transaction hash.
 */
export default async function transferCoin(
  to: string,
  amount: number,
  pk: string,
) {
  const account = await getAccount();
  const txHash = await fetch(`${HOST}/transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pk, recipient: to, amount }),
  });
  return txHash;
}
