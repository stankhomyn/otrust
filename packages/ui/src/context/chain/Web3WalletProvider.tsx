/* eslint-disable import/no-extraneous-dependencies */
import React, { useMemo } from 'react';
import { EthWeb3Provider, useWeb3React } from '@onomy/react-eth';
import ethers from 'ethers';
import { WalletProvider } from '@onomy/react-wallet';
import { WebWalletBackend } from '@onomy/wallet-backend-web';

import { KEPLR_CONFIG } from 'constants/env';

function Web3WalletChild({ children }: { children: JSX.Element | JSX.Element[] }) {
  const { library: ethereumProvider } = useWeb3React<ethers.providers.Web3Provider>();
  const ethereumSigner = useMemo(
    () => ethereumProvider?.getSigner() ?? undefined,
    [ethereumProvider]
  );

  const backend = useMemo(
    () => new WebWalletBackend({ ethereumProvider, ethereumSigner }),
    [ethereumProvider, ethereumSigner]
  );

  return (
    <WalletProvider backend={backend} onomyChainInfo={KEPLR_CONFIG}>
      {children}
    </WalletProvider>
  );
}

export function Web3WalletProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <EthWeb3Provider>
      <Web3WalletChild>{children}</Web3WalletChild>
    </EthWeb3Provider>
  );
}
