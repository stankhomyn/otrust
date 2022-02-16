import React from 'react';

import { useOnomy } from 'context/chain/OnomyContext';
import { NomBalanceDisplay } from 'components/NomBalanceDisplay';

export function BridgeProgress() {
  const { amount: nomBalance, address: nomAddress, bridgeProgress } = useOnomy();

  return (
    <>
      <div>
        Total Bridged: <NomBalanceDisplay value={nomBalance} />
      </div>
      {nomAddress && bridgeProgress !== null && (
        <>
          <div>
            <span>Progress: {bridgeProgress}%</span>
          </div>
        </>
      )}
    </>
  );
}
