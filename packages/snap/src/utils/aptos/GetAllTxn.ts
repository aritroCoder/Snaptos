/* eslint-disable */
import getAccount from './GetAccount';

const HOST = 'http://localhost:5500';

export async function getAllTxn() {
  const networkType = 'TESTNET';

  const account = await getAccount();
  const txnHistory = await fetch(`${HOST}/getTxn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address: account.accountAddress.toString(), network: networkType }),
  });
  const txnData = await txnHistory.json();
  console.log('this is txnhistory', txnData);
  return txnData;
}
