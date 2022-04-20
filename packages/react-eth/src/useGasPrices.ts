import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { useAsyncValue } from '@onomy/react-utils';

import { useOnomyEth } from './OnomyEthProvider';

export function useGasPrices() {
  const { provider } = useOnomyEth();
  const query = useCallback(async () => {
    if (!provider) {
      return {
        safe: new BigNumber('0'),
        propose: new BigNumber('0'),
        fast: new BigNumber('0'),
      };
    }
    const base = await provider.getGasPrice();
    const safe = new BigNumber(base.toString());
    const propose = safe.multipliedBy(1.1);
    const fast = safe.multipliedBy(1.2);
    return {
      safe,
      propose,
      fast,
    };
  }, [provider]);

  return useAsyncValue(query, {
    safe: new BigNumber('0'),
    propose: new BigNumber('0'),
    fast: new BigNumber('0'),
  });
}
