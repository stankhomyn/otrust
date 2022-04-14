import React, { useMemo } from 'react';
import { OnomyEthProvider, useOnomyEth } from '@onomy/react-eth';
import { OnomyProvider, useWallet, WalletProvider } from '@onomy/react-client';
import { WebWalletBackend } from '@onomy/wallet-backend-web';

import {
  KEPLR_CONFIG,
  REACT_APP_BONDING_NOM_CONTRACT_ADDRESS,
  REACT_APP_GRAPHQL_ENDPOINT,
  REACT_APP_GRAVITY_CONTRACT_ADDRESS,
  REACT_APP_WNOM_CONTRACT_ADDRESS,
} from 'constants/env';

function OnomyChildProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { blockNumber } = useOnomyEth();
  const { onomySigner } = useWallet();

  return (
    <OnomyProvider signer={onomySigner} rpcUrl={KEPLR_CONFIG.rpc} ethBlockNumber={blockNumber}>
      {children}
    </OnomyProvider>
  );
}

export function AppProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  /*
  const [backend] = useAsyncValue(
    useCallback(async () => {
      const be = new WebWalletBackend();
      return be;
    }, []),
    null
  );
  if (!backend) return null;
  */
  const backend = useMemo(() => new WebWalletBackend(), []);

  return (
    <OnomyEthProvider
      graphQlEndpoint={REACT_APP_GRAPHQL_ENDPOINT}
      nomContractAddress={REACT_APP_WNOM_CONTRACT_ADDRESS}
      bondContractAddress={REACT_APP_BONDING_NOM_CONTRACT_ADDRESS}
      gravityContractAddress={REACT_APP_GRAVITY_CONTRACT_ADDRESS}
    >
      <WalletProvider backend={backend} onomyChainInfo={KEPLR_CONFIG}>
        <OnomyChildProvider>{children}</OnomyChildProvider>
      </WalletProvider>
    </OnomyEthProvider>
  );
}

export default AppProvider;
