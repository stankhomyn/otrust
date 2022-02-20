/* eslint-disable react/require-default-props */
import React from 'react';
import { BigNumber } from 'bignumber.js';

import { format18 } from 'utils/math';
import { FormattedNumber } from './FormattedNumber';
import { useOnomy } from 'context/chain/OnomyContext';
import { EquivalentValue } from './EquivalentValue';
import { useDelegationTotalValue, useWrappedNomValue } from 'hooks/onomy-hooks';

export function NomBalanceDisplay({
  value,
  usdValue = false,
}: {
  value: string;
  usdValue?: boolean;
}) {
  const val = new BigNumber(value);
  const display = format18(val).toNumber();
  if (usdValue) {
    return <EquivalentValue amount={display} asset="NOM" />;
  }

  return <FormattedNumber value={display} />;
}

export function MyWrappedNomBalanceDisplay() {
  const wrappedNom = useWrappedNomValue();
  return <NomBalanceDisplay value={wrappedNom.toString()} />;
}

export function MyBridgedNomBalanceDisplay({ usdValue = false } = {}) {
  const { amount } = useOnomy();
  return <NomBalanceDisplay value={amount} usdValue={usdValue} />;
}

export function MyDelegatedNomBalanceDisplay({ usdValue = false }) {
  const [value] = useDelegationTotalValue();
  return <NomBalanceDisplay value={value.toString()} usdValue={usdValue} />;
}
