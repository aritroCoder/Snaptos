/* eslint-disable  */
import getAccount from './GetAccount';

const HOST = 'http://localhost:5500';

export async function fundMe(network: string) {
  const networkType = network.toUpperCase();
    const account = await getAccount();
    const Faucet = await fetch(`${HOST}/fundMe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: account.accountAddress.toString(), network: networkType }),
      }).then((res) => res.json());
      console.log('this is Faucet', Faucet.tx);
      return Faucet.tx;
}