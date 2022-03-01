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

function useValidatorsFetchCb() {
  const { address, onomyClient } = useOnomy();
  return useCallback(() => onomyClient.getValidatorsForDelegator(address), [address, onomyClient]);
}

export function useValidators() {
  return useAsyncPoll(useValidatorsFetchCb(), []);
}

function useValidatorFetchCb(id?: string) {
  const { onomyClient, address } = useOnomy();
  return useCallback(async () => {
    if (!id) return { validator: null, delegation: new BigNumber(0) };
    const [validators, selfDelegation, delegationData, rewardsData] = await Promise.all([
      // TODO: more focused query?
      onomyClient.getValidators(),
      onomyClient.getSelfDelegation(id),
      address ? onomyClient.getDelegation(id, address) : Promise.resolve(new BigNumber(0)),
      address ? onomyClient.getRewardsForDelegator(address) : Promise.resolve(null),
    ]);
    const validatorData = validators.find(v => v.operatorAddress === id);
    if (!validatorData) return { validator: null, delegation: delegationData };
    const selfStakeRate = selfDelegation.div(validatorData.tokens);
    const rewardItems = rewardsData?.rewards.find(v => v.validatorAddress === id);
    const rewardItem = rewardItems?.reward.find(r => r.denom === 'nom'); // TODO: don't hardcode?
    return {
      validator: validatorData,
      selfDelegation,
      selfStake: selfStakeRate ? selfStakeRate.toNumber() : 0,
      delegation: delegationData,
      rewards: rewardItem,
    };
  }, [onomyClient, id, address]);
}

export function useValidator(id?: string) {
  return useAsyncPoll(useValidatorFetchCb(id), {
    validator: null,
    delegation: new BigNumber(0),
    rewards: null,
    selfStake: 0,
  });
}

export type ValidatorData = ReturnType<typeof useValidator>[0];
