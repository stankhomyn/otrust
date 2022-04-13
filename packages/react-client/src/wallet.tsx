import React, { createContext, useContext, useMemo } from 'react';
import { Wallet, WalletBackend } from '@onomy/wallet';

export type ChainInfo = Parameters<InstanceType<typeof Wallet>['cosmos']>[1];

function useWalletState(backend: WalletBackend, onomyChainInfo: ChainInfo) {
  return useMemo(() => {
    const core = new Wallet(backend);

    // TODO: This logic probably shouldn't stay here, keplr specific?
    const chainIdParts = onomyChainInfo?.chainId.split('-') ?? [];
    chainIdParts.pop();
    const chainId = chainIdParts.join('-');

    const onomy = core.cosmos(chainId, onomyChainInfo);
    return { core, onomy };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend, JSON.stringify(onomyChainInfo)]);
}

export type WalletState = ReturnType<typeof useWalletState>;
const DEFAULT_STATE = null as unknown as WalletState;
const WalletContext = createContext(DEFAULT_STATE);

export function useWallet() {
  return useContext(WalletContext);
}

export function WalletProvider({
  children,
  onomyChainInfo,
  backend,
}: {
  children: JSX.Element | JSX.Element[];
  onomyChainInfo?: ChainInfo;
  backend: WalletBackend;
}) {
  const state = useWalletState(backend, onomyChainInfo);
  return <WalletContext.Provider value={state}>{children}</WalletContext.Provider>;
}
