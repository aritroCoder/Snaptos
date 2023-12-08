import getAccount from './GetAccount';

const HOST = 'http://localhost:5500';

export async function getBal() {
    const account = await getAccount();
    const balance = await fetch(`${HOST}/getBalance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: account.accountAddress.toString() }),
      }).then((res) => res.json());
      const bal = balance[0].amount;
      console.log('this is bal', bal);
      return bal;
}