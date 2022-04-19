import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { Wallet, WalletBackend } from '@onomy/wallet';
import { useAsyncPoll } from '@onomy/react-utils';

export type ChainInfo = Parameters<InstanceType<typeof Wallet>['cosmos']>[1];

function useWalletState(backend: WalletBackend, onomyChainInfo: ChainInfo) {
  const wallet = useMemo(() => {
    const core = new Wallet(backend);

    // TODO: This logic probably shouldn't stay here, keplr specific?
    const chainIdParts = onomyChainInfo?.chainId.split('-') ?? [];
    chainIdParts.pop();
    const chainId = chainIdParts.join('-');

    const onomy = core.cosmos(chainId, onomyChainInfo);
    const ethereum = core.ethereum();
    return { core, onomy, ethereum };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backend, JSON.stringify(onomyChainInfo)]);

  // TODO: this useAsyncPoll approach is kind of dirty could be improved
  const [onomySigner] = useAsyncPoll(
    useCallback(async () => wallet.onomy.getSigner(), [wallet]),
    null,
    1000
  );

  const [ethereumSigner] = useAsyncPoll(
    useCallback(async () => wallet.ethereum.getSigner().catch(() => null), [wallet]),
    null,
    1000
  );

  const [ethereumProvider] = useAsyncPoll(
    useCallback(async () => wallet.ethereum.getProvider().catch(() => null), [wallet]),
    null,
    1000
  );

  return {
    ...wallet,
    onomySigner,
    ethereumSigner,
    ethereumProvider,
  };
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
