/* eslint-disable  */
const HOST = 'http://localhost:5500';

export async function getUSD() {
  const price = await fetch(`${HOST}/aptToUsd`).then((res) => res.json());
  console.log('this is PRICE', price.APT );
  return price.APT;
}