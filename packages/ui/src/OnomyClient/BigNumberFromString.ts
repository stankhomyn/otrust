// Based on https://github.com/gcanti/io-ts-types/blob/master/src/BigIntFromString.ts
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { chain } from 'fp-ts/lib/Either';
import { NonEmptyString } from 'io-ts-types';
import BigNumber from 'bignumber.js';

export interface BigNumberFromStringC extends t.Type<BigNumber, string, unknown> {}

export const BigNumberFromString: BigNumberFromStringC = new t.Type<BigNumber, string, unknown>(
  'BigIntFromString',
  // tslint:disable-next-line
  (u): u is BigNumber => u instanceof BigNumber,
  (u, c) =>
    pipe(
      t.string.validate(u, c),
      chain(s => {
        if (!NonEmptyString.is(s.trim())) {
          return t.failure(u, c);
        }
        try {
          return t.success(new BigNumber(s));
        } catch (error) {
          return t.failure(u, c);
        }
      })
    ),
  String
);
