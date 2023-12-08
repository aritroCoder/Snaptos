import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';

import createAccount from './utils/aptos/CreateAccount';
import transferCoin from './utils/aptos/TransferCoin';
import { fundMe } from './utils/aptos/Faucets';
import { getAllTxn } from './utils/aptos/GetAllTxn';
import { getBal } from './utils/aptos/GetBal';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @param args.request.method - The method of the request.
 * @param args.request.params - The params of the request.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}: {
  origin: string;
  request: {
    method: string;
    params: any;
  };
}) => {
  switch (request.method) {
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            text(`Hello, **${origin}**!`),
            text('This custom confirmation is just for display purposes.'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
      break;
    case 'getAccount': {
      const accountDetails = await createAccount();
      return  {address : accountDetails.accountAddress, bal : accountDetails.balance} ;
      break;
    }
    case 'transferCoin': {
      const { to, amount } = request.params;
      console.log('this is to', to);
      const txHash = await transferCoin(to, amount);
      return { txHash };
      break;
    }
    case 'fundMe': {
      const txHash = await fundMe();
      return { txHash };
      break;
    }
    case 'txnHistory': {
      const txnHistory = await getAllTxn();
      return { txnHistory };
      break;
    }
    case 'getBalance': {
      const balance = await getBal();
      return { balance };
      break;
    }
    default:
      throw new Error('Method not found.');
  }
};
