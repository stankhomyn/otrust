import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { useAsyncValue } from '@onomy/react-utils';
import { useWeb3React } from '@web3-react/core';

export function useGasPrices() {
  const { library } = useWeb3React();
  const query = useCallback(async () => {
    const base = await library.getGasPrice();
    const safe = new BigNumber(base.toString());
    const propose = safe.multipliedBy(1.1);
    const fast = safe.multipliedBy(1.2);
    return {
      safe,
      propose,
      fast,
    };
  }, [library]);

  return useAsyncValue(query, {
    safe: new BigNumber('0'),
    propose: new BigNumber('0'),
    fast: new BigNumber('0'),
  });
}
