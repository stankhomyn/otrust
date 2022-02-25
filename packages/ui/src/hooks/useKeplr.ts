import { useRef, useCallback, useState } from 'react';
import { ChainInfo } from '@keplr-wallet/types';

export function useKeplr(chainInfo: ChainInfo) {
  const [address, setAddress] = useState('');
  const keplrConnected = useRef(false);
  const hasKeplr = !!window.keplr;

  const connect = useCallback(async () => {
    if (keplrConnected.current) return;
    keplrConnected.current = true;
    try {
      if (window.keplr) {
        await window.keplr.experimentalSuggestChain(chainInfo);
        // Staking coin information
        await window.keplr.enable(chainInfo.chainId);
        if (!window.getOfflineSigner) throw new Error('No Offline Signer');
        const offlineSigner = window.getOfflineSigner(chainInfo.chainId);
        const accounts = await offlineSigner.getAccounts();
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
  }, []);

  return {
    address,
    hasKeplr,
    connect,
  };
}
