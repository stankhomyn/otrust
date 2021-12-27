import React from 'react';

import { useOnomy } from 'context/chain/OnomyContext';
import { NomBalanceDisplay } from 'components/NomBalanceDisplay';
import {
  Balance,
  BalancePrice,
  BalanceNumber,
  Hint,
  TooltipCaption,
  TooltipDesc,
} from './SidebarStyles';

export function SidebarBridgedBalance() {
  const { amount: nomBalance, address: nomAddress, bridgeProgress } = useOnomy();

  return (
    <>
      {nomAddress && (
        <Balance>
          <BalancePrice>
            <strong>NOM Balance</strong>
            <BalanceNumber strong>
              <NomBalanceDisplay value={nomBalance} />
              {bridgeProgress === null ? (
                <small> = $16,208.04</small>
              ) : (
                <small>{bridgeProgress.toFixed(2)}%</small>
              )}
            </BalanceNumber>
          </BalancePrice>
          <Hint>
            <TooltipCaption>NOM Balance</TooltipCaption>
            <TooltipDesc>This shows your total NOM balance on the Onomy chain</TooltipDesc>
          </Hint>
        </Balance>
      )}
    </>
  );
}
