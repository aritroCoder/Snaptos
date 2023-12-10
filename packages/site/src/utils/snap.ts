import type { MetaMaskInpageProvider } from '@metamask/providers';
import { Maybe } from '@metamask/providers/dist/utils';
import { SHA256 } from 'crypto-js';

import { defaultSnapOrigin } from '../config';
import type { GetSnapsResponse, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (
  provider?: MetaMaskInpageProvider,
): Promise<GetSnapsResponse> =>
  (await (provider ?? window.ethereum).request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) =>
        snap.id === defaultSnapOrigin && (!version || snap.version === version),
    );
  } catch (error) {
    console.log('Failed to obtain installed snap', error);
    return undefined;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: { snapId: defaultSnapOrigin, request: { method: 'hello' } },
  });
};

/**
 * Invoke the "getAccount" method from the example snap.
 * @param password - The password to use to decrypt the account.
 * @returns The account data returned by the snap.
 */
export const sendGetAccount = async (password: string) => {
  const accountData = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'getAccount',
        params: { password: SHA256(password).toString() },
      },
    },
  });
  console.log('this is accountData', accountData);
  return accountData;
};

export const sendCoin = async (to: string, amount: number) => {
  const txHash = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'transferCoin',
        params: { to, amount },
      },
    },
  });
  console.log('this is txHash', txHash);
};

export const sendFundMe = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'fundMe',
      },
    },
  });
};

export const sendTxnHistory = async () => {
  const txnHistory = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'txnHistory',
      },
    },
  });
  console.log('this is txnHistory', txnHistory);
  return txnHistory;
};

export const sendGetBalance = async () => {
  const balance: any = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'getBalance',
      },
    },
  });
  console.log('this is balance', balance);
  return balance.balance;
};

export const sendSetData = async (
  pvtKey: string,
  address: string,
  password: string,
) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'setData',
        params: { pvtKey, address, password },
      },
    },
  });
};

export const sendGetData = async (password: string) => {
  const data = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: 'getData',
        params: { password },
      },
    },
  });
  console.log('this is data', data);
  return data;
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
