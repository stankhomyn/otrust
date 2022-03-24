import BigNumber from 'bignumber.js';

import { OnomyConstants } from './OnomyConstants';

function getInflationRateForSupply(supply: number) {
  return (
    OnomyConstants.STAKE_REWARD_PEAK_HEIGHT *
    Math.exp(
      (-1 * (supply - OnomyConstants.STAKE_REWARD_PEAK_POSITION) ** 2) /
        (2 * OnomyConstants.STAKE_REWARD_STD_DEV ** 2)
    )
  );
}

function getEstYearlyStakingRewardPercentage(
  totalBridgedAtoms: BigNumber,
  totalStakedAtoms: BigNumber,
  inflationRate: number
) {
  const stakingRatio = totalStakedAtoms.div(totalBridgedAtoms).toNumber();
  return (inflationRate / stakingRatio) * 100;
}

export const OnomyFormulas = {
  getInflationRateForSupply,
  getEstYearlyStakingRewardPercentage,
};
