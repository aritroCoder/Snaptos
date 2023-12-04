import { Aptos } from '@aptos-labs/ts-sdk';

export async function genTxn(reqBody: {
  to: string;
  amount: number;
  addr: string;
}) {
  const aptos = new Aptos();
  const { to, amount, addr } = reqBody;
  const tx = await aptos.build.transaction({
    sender: addr,
    data: {
      function: '0x1::coin::transfer',
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
      payload: [to, amount],
    },
  });
  return tx;
}
