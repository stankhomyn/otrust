import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';

import { DENOM } from 'constants/env';
import { useOnomy } from 'context/chain/OnomyContext';
import { useChain } from 'context/chain/ChainContext';
import { useAsyncPoll } from './useAsyncPoll';

export function useBridgedBalanceValue() {
  const { amount } = useOnomy();
  return useMemo(() => new BigNumber(amount), [amount]);
}

export function useWrappedNomValue() {
  const { weakBalance } = useChain();
  return useMemo(() => new BigNumber(weakBalance), [weakBalance]);
}

export function useDelegationTotalFetchCb() {
  const { onomyClient, address } = useOnomy();

  return useCallback(async () => {
    const resp = await onomyClient.getDelegationsForDelegator(address);
    return resp.reduce((val, item) => {
      if (item.balance.denom !== DENOM) return val;
      return val.plus(new BigNumber(item.balance.amount));
    }, new BigNumber(0));
  }, [onomyClient, address]);
}

export function useDelegationTotalValue() {
  return useAsyncPoll(useDelegationTotalFetchCb(), new BigNumber(0));
}
