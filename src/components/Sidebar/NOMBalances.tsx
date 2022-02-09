import React from 'react';
// import styled from 'styled-components';

import { EquivalentValue } from 'components/EquivalentValue';
import {
  Balances,
  Balance,
  BalancePrice,
  BalanceNumber,
  Hint,
  TooltipCaption,
  TooltipDesc,
} from './SidebarStyles';

export default function NOMBalances() {
  return (
    <Balances>
      <Balance>
        <BalancePrice>
          <strong>NOM Balance (Bridged)</strong>
          <BalanceNumber strong>
            23.2091
            <small>
              <EquivalentValue amount={4208.12} asset="ETH" />
            </small>
          </BalanceNumber>
        </BalancePrice>
        <Hint>
          <TooltipCaption>NOM Balance</TooltipCaption>
          <TooltipDesc>
            This shows your total wNOM balance and the amount approved for selling. You must approve
            wNOM for selling before it can be sold.
          </TooltipDesc>
        </Hint>
      </Balance>

      <Balance>
        <BalancePrice>
          <strong>NOM Delegated</strong>
          <BalanceNumber strong>
            23.2091
            <small>
              <EquivalentValue amount={4208.12} asset="ETH" />
            </small>
          </BalanceNumber>
        </BalancePrice>
        <Hint>
          <TooltipCaption>NOM Balance</TooltipCaption>
          <TooltipDesc>
            This shows your total wNOM balance and the amount approved for selling. You must approve
            wNOM for selling before it can be sold.
          </TooltipDesc>
        </Hint>
      </Balance>
    </Balances>
  );
}
