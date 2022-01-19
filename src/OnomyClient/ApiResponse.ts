import * as t from 'io-ts';
import * as T from 'io-ts-types';

import { BigNumberFromString } from './BigNumberFromString';

const PaginationMeta = t.type({
  next_key: t.any,
  total: T.IntFromString,
});

const CosmosAmount = t.type({
  amount: BigNumberFromString,
  denom: t.string,
});

// /cosmos/bank/v1beta1/supply/${denom}
const SingleSupplyResponse = t.type({
  amount: CosmosAmount,
});

const Validator = t.type({
  operator_address: t.string,
  consensus_pubkey: t.type({
    type: t.string,
    value: t.string,
  }),
  status: t.number,
  tokens: BigNumberFromString,
  delegator_shares: BigNumberFromString,
  description: t.partial({
    moniker: t.string,
    website: t.string,
    details: t.string,
  }),
  unbonding_time: T.DateFromISOString,
  commission: t.type({
    commission_rates: t.type({
      rate: BigNumberFromString,
      max_rate: BigNumberFromString,
      max_change_rate: BigNumberFromString,
    }),
    update_time: T.DateFromISOString,
  }),
  min_self_delegation: BigNumberFromString,
});

// /staking/validators?status=BOND_STATUS_BONDED
const ValidatorsResponse = t.type({
  height: T.IntFromString,
  result: t.array(Validator),
});

const Account = t.type({
  '@type': t.string,
  address: t.string,
  pub_key: t.type({
    '@type': t.string,
    key: t.string,
  }),
  account_number: T.IntFromString,
  sequence: T.IntFromString,
});

// /osmos/auth/v1beta1/accounts/${address}
const SingleAccountResponse = t.type({
  account: Account,
});

const SlashingParams = t.type({
  signed_blocks_window: T.IntFromString,
  min_signed_per_window: BigNumberFromString,
  downtime_jail_duration: t.string, // TODO: duration parser?
  slash_fraction_double_sign: BigNumberFromString,
  slash_fraction_downtime: BigNumberFromString,
});

// /cosmos/slashing/v1beta1/params
const SlashingParamsResponse = t.type({
  params: SlashingParams,
});

const SigningInfo = t.type({
  address: t.string,
  start_height: T.IntFromString,
  index_offset: T.IntFromString,
  jailed_until: T.DateFromISOString,
  tombstoned: t.boolean,
  missed_blocks_counter: T.IntFromString,
});

// /cosmos/slashing/v1beta1/signing_infos
const SingingInfosResponse = t.type({
  info: t.array(SigningInfo),
  pagination: PaginationMeta,
});

const Delegation = t.type({
  delegation: t.type({
    delegator_address: t.string,
    validator_address: t.string,
    shares: BigNumberFromString,
  }),
  balance: CosmosAmount,
});

// /cosmos/staking/v1beta1/validators/${validatorAddress}/delegations/${delegatorAddress}
const DelegationResponse = t.type({
  delegation_response: Delegation,
});

// /cosmos/staking/v1beta1/delegations/${delegatorAddress}
const DelegationsResponse = t.type({
  delegation_responses: Delegation,
  pagination: PaginationMeta,
});

const UnbondingEntry = t.type({
  creation_height: T.IntFromString,
  completion_time: T.DateFromISOString,
  initial_balance: BigNumberFromString,
  balance: BigNumberFromString,
});

const Unbonding = t.type({
  delegator_address: t.string,
  validator_address: t.string,
  entries: t.array(UnbondingEntry),
});

const UnbondingsResponse = t.type({
  unbonding_responses: t.array(Unbonding),
  pagination: PaginationMeta,
});

const DelegatorReward = t.type({
  validator_address: t.string,
  reward: t.array(CosmosAmount),
});

// /cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards
const DelegatorRewardsResponse = t.type({
  rewards: t.array(DelegatorReward),
  total: t.array(CosmosAmount),
});

const StakingPool = t.type({
  not_bonded_tokens: BigNumberFromString,
  bonded_tokens: BigNumberFromString,
});

// /cosmos/staking/v1beta1/pool
const StakingPoolResponse = t.type({ pool: StakingPool });

// /cosmos/mint/v1beta1/inflation
const MintInflationResponse = t.type({ inflation: BigNumberFromString });

const MintParams = t.type({
  mint_denom: t.string,
  inflation_rate_change: BigNumberFromString,
  inflation_max: BigNumberFromString,
  inflation_min: BigNumberFromString,
  goal_bonded: BigNumberFromString,
  blocks_per_year: T.IntFromString,
});

// /cosmos/mint/v1beta1/params
const MintParamsResponse = t.type({ params: MintParams });

// /cosmos/mint/v1beta1/annual_provisions
const MintAnnualProvisionsResponse = t.type({
  annual_provisions: BigNumberFromString,
});

export const ApiResponseCodec = {
  PaginationMeta,

  CosmosAmount,
  SingleSupplyResponse,

  Validator,
  ValidatorsResponse,

  Account,
  SingleAccountResponse,

  SlashingParams,
  SlashingParamsResponse,

  SigningInfo,
  SingingInfosResponse,

  Delegation,
  DelegationResponse,
  DelegationsResponse,

  UnbondingEntry,
  Unbonding,
  UnbondingsResponse,

  DelegatorReward,
  DelegatorRewardsResponse,

  StakingPool,
  StakingPoolResponse,

  MintInflationResponse,

  MintParams,
  MintParamsResponse,

  MintAnnualProvisionsResponse,
};

export namespace ApiResponseType {
  export type Validator = t.TypeOf<typeof ApiResponseCodec.Validator>;
}
