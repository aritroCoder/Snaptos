import { SLIP10Node } from '@metamask/key-tree';
import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';

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
    case 'getKeyPair': {
      const rootNode = await snap.request({
        method: 'snap_getBip32Entropy',
        params: {
          path: [`m`, `44'`, `637'`],
          curve: 'ed25519',
        },
      });
      const node = await SLIP10Node.fromJSON(rootNode);
      const keyPair = await node.derive([`slip10:0'`]);
      return { keyPair };
      break;
    }
    default:
      throw new Error('Method not found.');
  }
};
