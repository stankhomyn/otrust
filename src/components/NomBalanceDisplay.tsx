import React from 'react';
import { BigNumber } from 'bignumber.js';

import { format18 } from 'utils/math';
import { useChain } from 'context/chain/ChainContext';
import { FormattedNumber } from './FormattedNumber';
import { useOnomy } from 'context/chain/OnomyContext';

export function NomBalanceDisplay({ value }: { value: string }) {
  const val = new BigNumber(value);
  const display = format18(val).toNumber();
  return <FormattedNumber value={display} />;
}

export function MyWrappedNomBalanceDisplay() {
  const { weakBalance } = useChain();
  return <NomBalanceDisplay value={weakBalance.toString()} />;
}

export function MyBridgedNomBalanceDisplay() {
  const { amount } = useOnomy();

  return <NomBalanceDisplay value={amount} />;
}
