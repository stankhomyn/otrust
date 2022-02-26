import { useRef, useCallback, useState, useMemo } from 'react';
import { ChainInfo, Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

type OfflineSigner = ReturnType<Keplr["getOfflineSigner"]>;

export function useKeplr(chainInfo: ChainInfo) {
  const [address, setAddress] = useState('');
  const [signer, setSigner] = useState<OfflineSigner | null>(null);
  const keplrConnected = useRef(false);
  const keplrWindow = window as KeplrWindow;
  const hasKeplr = !!keplrWindow.keplr;
  const chainId = useMemo(() => {
    const chainIdParts = chainInfo.chainId.split('-');
    chainIdParts.pop();
    return chainIdParts.join('-');
  }, [chainInfo.chainId]);

  const connect = useCallback(async () => {
    if (keplrConnected.current) return;
    keplrConnected.current = true;
    try {
      if (keplrWindow.keplr) {
        await keplrWindow.keplr.experimentalSuggestChain(chainInfo);
        // Staking coin information
        await keplrWindow.keplr.enable(chainId);
        if (!keplrWindow.getOfflineSigner) throw new Error('No Offline Signer');
        const offlineSigner = keplrWindow.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        setSigner(offlineSigner);
        setAddress(() => accounts[0].address);
      } else {
        // eslint-disable-next-line no-console
        console.error('Install keplr chrome extension');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('keplr error', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return {
    keplr: keplrWindow.keplr,
    signer,
    address,
    hasKeplr,
    connect,
  };
}
