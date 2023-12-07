import { AccountAddress, Aptos } from '@aptos-labs/ts-sdk';

export async function genTxn(reqBody: {
  to: string;
  amount: number;
  addr: AccountAddress;
}) {
  const aptos = new Aptos();
  const { to, amount, addr } = reqBody;
  const tx = await aptos.build.transaction({
    sender: addr,
    data: {
      function: '0x1::aptos_account::transfer_coins',
      typeArguments: ['0x1::aptos_coin::AptosCoin'],
      functionArguments: [to, amount],
    },
  });
  return tx;
} 

