import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { copyable, heading, panel, text } from '@metamask/snaps-ui';

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
      const { password, network } = request.params;
      const accountDetails = await createAccount(network);

      const responseData = {
        snapRequest: snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([
              heading('Account Details'),
              text(`Address: **${accountDetails.accountAddress}**`),
              text(
                'If you have created your account in devnet/testnet, we have already funded some Aptos to your account.',
              ),
            ]),
          },
        }),
        accountInfo: {
          address: accountDetails.accountAddress,
          bal: accountDetails.balance,
        },
      };

      await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'update',
          newState: {
            pvtKey: accountDetails.privateKey,
            address: accountDetails.accountAddress,
            password,
            network,
          },
        },
      });
      return responseData;
    }

    // send tokens
    case 'transferCoin': {
      const {
        to,
        amount,
        network
      }: {
        to: string;
        amount: number;
        network: string;
      } = request.params;
      const result = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('Transfer Coin'),
            text(`To:`),
            copyable(`${to}`),
            text(`Amount: **${amount}**`),
            panel([
              heading('Gas fee insights'),
              text('Average price per gas unit: **0.000001 APT**'),
              text('Max price per gas unit: **0.0000015 APT**'),
              text('Max gas limit: **200**(upto **0.0003 APT**)'),
            ]),
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
      const txHash: { hash: string } = await transferCoin(to, amount, enpk, network);
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: panel([
            heading('Amount transferred successfully.'),
            text(`To:`),
            copyable(`${to}`),
            text(`Amount: **${amount}**`),
            text(`Transaction Hash:`),
            copyable(`${txHash.hash}`),
          ]),
        },
      });
      break;
    }

    // fund account by faucet
    case 'fundMe': {
      const { network } = request.params;
      const txHash: string = await fundMe(network);
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: panel([
            heading('Funded 1 APT successfully.'),
            text(`Transaction Hash:`),
            copyable(`${txHash}`),
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
        network,
      }: {
        pvtKey: string;
        address: string;
        password: string;
        network: string;
      } = request.params;
      await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'update',
          newState: { pvtKey, address, password, network },
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
        network: string;
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
      const {network} = request.params;
      const txnHistory = await getAllTxn(network);
      console.log('this is txnHistory', txnHistory);
      return { txnHistory };
      break;
    }
    case 'getBalance': {
      const {network} = request.params;
      const balance = await getBal(network);
      return { balance };
      break;
    }
    default:
      throw new Error('Method not found.');
  }
};
