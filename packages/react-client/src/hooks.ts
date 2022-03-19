import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { useAsyncPoll } from '@onomy/react-utils';
import { OnomyConstants, OnomyFormulas } from '@onomy/client';

import { useOnomy } from './context';

export function useBridgedBalanceValue() {
  const { amount } = useOnomy();
  return useMemo(() => new BigNumber(amount), [amount]);
}

function useDelegationTotalFetchCb() {
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

function useUnbondingTotalFetchCb() {
  const { onomyClient, address } = useOnomy();

  return useCallback(async () => {
    if (!address) return new BigNumber(0);
    return onomyClient.getTotalUnbondingForDelegator(address);
  }, [onomyClient, address]);
}

export function useUnbondingTotalValue() {
  return useAsyncPoll(useUnbondingTotalFetchCb(), new BigNumber(0));
}

function useAnomSupplyFetchCb() {
  const { onomyClient } = useOnomy();
  return useCallback(() => onomyClient.getAnomSupply(), [onomyClient]);
}

export function useAnomSupply() {
  return useAsyncPoll(useAnomSupplyFetchCb(), new BigNumber(0));
}

export function useStakingRewardAPR() {
  const [bridgedSupply] = useAnomSupply();
  return useMemo(() => OnomyFormulas.stakingRewardAPR(bridgedSupply.toNumber()), [bridgedSupply]);
}

function useValidatorListFetchCb() {
  const { address, onomyClient } = useOnomy();
  return useCallback(() => onomyClient.getValidatorsForDelegator(address), [address, onomyClient]);
}

export function useValidatorList() {
  return useAsyncPoll(useValidatorListFetchCb(), []);
}

function useValidatorDetailFetchCb(id?: string) {
  const { onomyClient, address } = useOnomy();
  return useCallback(
    () => onomyClient.getValidatorForDelegator(address, id),
    [onomyClient, id, address]
  );
}

export function useValidatorDetail(id?: string) {
  return useAsyncPoll(useValidatorDetailFetchCb(id), {
    validator: null,
    delegation: new BigNumber(0),
    rewards: null,
    selfStake: 0,
    votingPower: 0,
  });
}

export type ValidatorData = ReturnType<typeof useValidatorDetail>[0];
