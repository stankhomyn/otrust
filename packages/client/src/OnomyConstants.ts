import { GasPrice } from '@cosmjs/stargate';

const DENOM = 'anom';
const STAKE_REWARD_PEAK_HEIGHT = 100;
const STAKE_REWARD_PEAK_POSITION = 150000000;
const STAKE_REWARD_STD_DEV = 50000000;
const TOTAL_COINS = 300000000;
const GAS_PRICE = GasPrice.fromString(`${0.001}${DENOM}`);

export const OnomyConstants = {
  DENOM,
  STAKE_REWARD_PEAK_HEIGHT,
  STAKE_REWARD_PEAK_POSITION,
  STAKE_REWARD_STD_DEV,
  TOTAL_COINS,
  GAS_PRICE,
};
