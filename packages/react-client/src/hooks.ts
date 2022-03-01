import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { useAsyncPoll } from '@onomy/react-utils';
import { OnomyConstants } from '@onomy/client';

import { useOnomy } from './context';

export function useBridgedBalanceValue() {
  const { amount } = useOnomy();
  return useMemo(() => new BigNumber(amount), [amount]);
}

export function useDelegationTotalFetchCb() {
  const { onomyClient, address } = useOnomy();

  return useCallback(async () => {
    if (!address) return new BigNumber(0);
    const resp = await onomyClient.getDelegationsForDelegator(address);
    return resp.reduce((val, item) => {
      if (item?.balance?.denom !== OnomyConstants.DENOM) return val;
      return val.plus(new BigNumber(item.balance.amount));
    }, new BigNumber(0));
  }, [onomyClient, address]);
}

export function useDelegationTotalValue() {
  return useAsyncPoll(useDelegationTotalFetchCb(), new BigNumber(0));
}
