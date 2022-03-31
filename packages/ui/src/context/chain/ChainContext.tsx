import React from 'react';
import { OnomyEthProvider, useOnomyEth } from '@onomy/react-eth';
import { OnomyProvider } from '@onomy/react-client';
import { KeplrProvider, useKeplr } from '@onomy/react-keplr';

import {
  KEPLR_CONFIG,
  REACT_APP_BONDING_NOM_CONTRACT_ADDRESS,
  REACT_APP_GRAPHQL_ENDPOINT,
  REACT_APP_GRAVITY_CONTRACT_ADDRESS,
  REACT_APP_WNOM_CONTRACT_ADDRESS,
} from 'constants/env';

function OnomyChildProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { blockNumber } = useOnomyEth();
  const { signer } = useKeplr();

  return (
    <OnomyProvider signer={signer} rpcUrl={KEPLR_CONFIG.rpc} ethBlockNumber={blockNumber}>
      {children}
    </OnomyProvider>
  );
}

export function AppProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <OnomyEthProvider
      graphQlEndpoint={REACT_APP_GRAPHQL_ENDPOINT}
      nomContractAddress={REACT_APP_WNOM_CONTRACT_ADDRESS}
      bondContractAddress={REACT_APP_BONDING_NOM_CONTRACT_ADDRESS}
      gravityContractAddress={REACT_APP_GRAVITY_CONTRACT_ADDRESS}
    >
      <KeplrProvider chainInfo={KEPLR_CONFIG}>
        <OnomyChildProvider>{children}</OnomyChildProvider>
      </KeplrProvider>
    </OnomyEthProvider>
  );
}

export default AppProvider;
