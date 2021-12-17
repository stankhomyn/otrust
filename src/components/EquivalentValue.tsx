import React from 'react';

type EquivalentValueProps = {
  amount: number | string;
  asset: 'ETH' | 'NOM';
  // eslint-disable-next-line react/require-default-props
  equivalent?: 'USD';
};
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EquivalentValue({ amount, asset, equivalent = 'USD' }: EquivalentValueProps) {
  // TODO: calculate and return equivalent value display
  // return <> = $16,208.04</>
  return <></>;
}
