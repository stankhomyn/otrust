import React from 'react';
import { useOnomy } from '@onomy/react-client';

import ProgressCircle from './ProgressCircle';

export function BridgeProgress() {
  const { address: nomAddress, bridgeProgress } = useOnomy();

  return (
    <>
      {nomAddress && bridgeProgress !== null && (
        <>
          <ProgressCircle message="Bridging assets…" percent={bridgeProgress} />
        </>
      )}
    </>
  );
}
