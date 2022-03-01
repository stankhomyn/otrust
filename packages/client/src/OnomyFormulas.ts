import { OnomyConstants } from './OnomyConstants';

function stakingRewardAPR(supply: number) {
  return (
    OnomyConstants.STAKE_REWARD_PEAK_HEIGHT *
    Math.exp(
      (-1 * (supply - OnomyConstants.STAKE_REWARD_PEAK_POSITION) ** 2) /
        (2 * OnomyConstants.STAKE_REWARD_STD_DEV ** 2)
    )
  );
}

export const OnomyFormulas = {
  stakingRewardAPR,
};
