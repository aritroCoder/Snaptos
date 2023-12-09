import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';

import createAccount from './utils/aptos/CreateAccount';
import transferCoin from './utils/aptos/TransferCoin';
import { fundMe } from './utils/aptos/Faucets';
import { getAllTxn } from './utils/aptos/GetAllTxn';
import { getBal } from './utils/aptos/GetBal';
import getAccount from './utils/aptos/GetAccount';
import encryptPhrase from './utils/encryption/encrypt';

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
    // create new account
    case 'getAccount': {
      const accountDetails = await createAccount();

      const responseData = {
        snapRequest: snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([
              heading('Account Details'),
              text(`Address: **${accountDetails.accountAddress}**`),
            ]),
          },
        }),
        accountInfo: {
          address: accountDetails.accountAddress,
          bal: accountDetails.balance,
        },
      };

      return responseData;
    }

    // send tokens
    case 'transferCoin': {
      const {
        to,
        amount,
      }: {
        to: string;
        amount: number;
      } = request.params;
      const result = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('Transfer Coin'),
            text(`To: **${to}**`),
            text(`Amount: **${amount}**`),
            text('Are you sure you want to transfer?'),
          ]),
        },
      });
      if (result !== true) {
        return { txHash: null };
        break;
      }
      const ac = await getAccount();
      const enpk = encryptPhrase(ac.privateKey.toString(), 'key');
      const txHash: { hash: string } = await transferCoin(to, amount, enpk);
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: panel([
            heading('Amount transferred successfully.'),
            text(`To: **${to}**`),
            text(`Amount: **${amount}**`),
            text(`Transaction Hash: **${txHash.hash}**`),
          ]),
        },
      });
      break;
    }

    // fund account by faucet
    case 'fundMe': {
      const txHash: string = await fundMe();
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: panel([
            heading('Funded 1 APT successfully.'),
            text(`Transaction Hash: **${txHash}**`),
          ]),
        },
      });
      break;
    }

    // set data to secure storage
    case 'setData': {
      const {
        pvtKey,
        address,
        password, // tip: use hashed password here
      }: {
        pvtKey: string;
        address: string;
        password: string;
      } = request.params;
      await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'update',
          newState: { pvtKey, address, password },
        },
      });
      break;
    }

    // get data from secure storage by entering correct password
    case 'getData': {
      const data: {
        pvtKey: string;
        address: string;
        password: string;
      } = await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'get',
        },
      });
      const { password } = request.params; // send hashed password here
      if (data.password !== password) {
        throw new Error('Password mismatch');
      }
      return data;
      break;
    }

    // get all past transactions
    case 'txnHistory': {
      const txnHistory = await getAllTxn();
      console.log('this is txnHistory', txnHistory);
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
