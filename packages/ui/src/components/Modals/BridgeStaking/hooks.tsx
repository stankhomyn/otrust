import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { useAsyncPoll } from '@onomy/react-utils';
import { OnomyFormulas } from '@onomy/client';

import { useOnomy } from 'context/chain/OnomyContext';
import { format18 } from 'utils/math';

export function useValidator() {
  const { onomyClient, address } = useOnomy();
  const { id } = useParams();

  return useAsyncPoll(
    useCallback(async () => {
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
    }, [onomyClient, id, address]),
    { validator: null, delegation: new BigNumber(0), rewards: null, selfStake: 0 }
  );
}

export type ValidatorData = ReturnType<typeof useValidator>[0];

export function useValidatorsTable() {
  const { address, onomyClient, bridgedSupplyFormatted: bridgedSupply } = useOnomy();
  const stakingAPR = useMemo(() => OnomyFormulas.stakingRewardAPR(bridgedSupply), [bridgedSupply]);

  return useAsyncPoll(
    useCallback(async () => {
      const [validators, delegationData] = await Promise.all([
        onomyClient.getValidators(),
        address ? onomyClient.getDelegationsForDelegator(address) : Promise.resolve([]),
      ]);

      return validators.map(validator => {
        const delegation = delegationData.find(
          d => d.delegation?.validatorAddress === validator.operatorAddress
        );
        return {
          id: validator.operatorAddress,
          validator: {
            name: validator.description?.moniker ?? validator.operatorAddress,
            votingPower: format18(new BigNumber(validator.delegatorShares)).toString(),
          },
          rewards: {
            APR: stakingAPR,
            commissionRate:
              format18(
                new BigNumber(validator.commission?.commissionRates?.rate ?? '0')
              ).toNumber() * 100,
          },
          delegated: format18(new BigNumber(delegation?.balance?.amount ?? '0')),
        };
      });
    }, [onomyClient, stakingAPR, address]),
    []
  );
}
