import * as t from 'io-ts';
import * as T from 'io-ts-types';

const CosmosAmount = t.type({
  amount: T.BigIntFromString,
  denom: t.string,
});

const SingleSupplyResponse = t.type({
  amount: CosmosAmount,
});

export const ApiResponseCodec = {
  CosmosAmount,
  SingleSupplyResponse,
};
