/* eslint-disable */
import { Aptos, getAptosFullNode, GasEstimation, AptosConfig, Network} from '@aptos-labs/ts-sdk';

const cache = new Map<string, { value: any; timestamp: number }>();

export async function getGasPriceEstimation(args: { aptosConfig: AptosConfig }) {
    function memoizeAsync<T>(
        func: (...args: any[]) => Promise<T>,
        key: string,
        ttlMs?: number,
      ): (...args: any[]) => Promise<T> {
        return async (...args: any[]) => {
          // Check if the cached result exists and is within TTL
          if (cache.has(key)) {
            const { value, timestamp } = cache.get(key)!;
            if (ttlMs === undefined || Date.now() - timestamp <= ttlMs) {
              return value;
            }
          }
      
          // If not cached or TTL expired, compute the result
          const result = await func(...args);
      
          // Cache the result with a timestamp
          cache.set(key, { value: result, timestamp: Date.now() });
      
          return result;
        };
      }
      
    const { aptosConfig } = args;
  
    return memoizeAsync(
      async () => {
        const { data } = await getAptosFullNode<{}, GasEstimation>({
          aptosConfig,
          originMethod: "getGasPriceEstimation",
          path: "estimate_gas_price",
        });
        return data;
      },
      `gas-price-${aptosConfig.network}`,
      1000 * 60 * 5, // 5 minutes
    )();
  }