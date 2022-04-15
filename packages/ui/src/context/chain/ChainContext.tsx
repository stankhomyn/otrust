import React, { useMemo } from 'react';
import { OnomyEthProvider, useOnomyEth, EthWeb3Provider } from '@onomy/react-eth';
import { OnomyProvider } from '@onomy/react-client';
import { WebWalletBackend } from '@onomy/wallet-backend-web';
import { WalletProvider } from '@onomy/react-wallet';

import {
  KEPLR_CONFIG,
  REACT_APP_BONDING_NOM_CONTRACT_ADDRESS,
  REACT_APP_GRAPHQL_ENDPOINT,
  REACT_APP_GRAVITY_CONTRACT_ADDRESS,
  REACT_APP_WNOM_CONTRACT_ADDRESS,
} from 'constants/env';

function OnomyChildProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { blockNumber } = useOnomyEth();

  return (
    <OnomyProvider rpcUrl={KEPLR_CONFIG.rpc} ethBlockNumber={blockNumber}>
      {children}
    </OnomyProvider>
  );
}

export function AppProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const backend = useMemo(() => new WebWalletBackend(), []);

  return (
    <EthWeb3Provider>
      <WalletProvider backend={backend} onomyChainInfo={KEPLR_CONFIG}>
        <OnomyEthProvider
          graphQlEndpoint={REACT_APP_GRAPHQL_ENDPOINT}
          nomContractAddress={REACT_APP_WNOM_CONTRACT_ADDRESS}
          bondContractAddress={REACT_APP_BONDING_NOM_CONTRACT_ADDRESS}
          gravityContractAddress={REACT_APP_GRAVITY_CONTRACT_ADDRESS}
        >
          <OnomyChildProvider>{children}</OnomyChildProvider>
        </OnomyEthProvider>
      </WalletProvider>
    </EthWeb3Provider>
  );
}

export default AppProvider;
