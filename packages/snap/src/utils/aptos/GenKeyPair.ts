import { SLIP10Node } from '@metamask/key-tree';

/**
 * Generate a keypair for the APTOS protocol.
 *
 * @returns {SLIP10Node} The keyPair.
 * @throws {Error} If the keypair could not be generated
 * @example
 * const keyPair = await getAptosEntropy();
 * const publicKey = keyPair.publicKey;
 * const privateKey = keyPair.privateKey;
 */
export async function getAptosEntropy(): Promise<SLIP10Node> {
  const rootNode = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: [`m`, `44'`, `637'`],
      curve: 'ed25519',
    },
  });
  const node = await SLIP10Node.fromJSON(rootNode);
  const keyPair = await node.derive([`slip10:0'`]);
  return keyPair;
}
