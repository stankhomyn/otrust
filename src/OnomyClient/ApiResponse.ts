import * as t from 'io-ts';
import * as T from 'io-ts-types';

import { BigNumberFromString } from './BigNumberFromString';

const CosmosAmount = t.type({
  amount: BigNumberFromString,
  denom: t.string,
});

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

const ValidatorsResponse = t.type({
  height: T.IntFromString,
  result: t.array(Validator),
});

export const ApiResponseCodec = {
  CosmosAmount,
  SingleSupplyResponse,
  Validator,
  ValidatorsResponse,
};
