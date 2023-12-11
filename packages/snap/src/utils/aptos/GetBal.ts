/* eslint-disable */
import getAccount from './GetAccount';

const HOST = 'http://localhost:5500';

export async function getBal(network: string) {
  const account = await getAccount();
  const networkType = network.toUpperCase();
  const balance = await fetch(`${HOST}/getBalance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: account.accountAddress.toString(),
      network: networkType,
    }),
  }).then((res) => res.json());
  if (balance) {
    console.log({ balance });
    if ('amount' in balance[0]) {
      const bal = balance[0].amount;
      console.log('this is bal', bal);
      return bal;
    }
  }
  return 0;
}
