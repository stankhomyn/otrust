import { StargateClient } from '@cosmjs/stargate';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useAsyncValue } from 'hooks/useAsyncValue';
import { useStateRef } from 'hooks/useStateRef';

// This is lame, but can't find a way to subscribe to cosmos events
const POLLING_INTERVAL = 1000;
const DENOM = 'anom';

function useOnomyState() {
  const [address, setAddress, addressRef] = useStateRef('');
  const [amount, setAmount] = useState('0');

  const [stargate] = useAsyncValue(
    useCallback(() => StargateClient.connect(`wss://${window.location.hostname}/tendermint`), []),
    null
  );

  useEffect(() => {
    if (!stargate) return;

    async function updateBalance() {
      if (!addressRef.current || !stargate) return;
      try {
        const coin = await stargate.getBalance(addressRef.current, DENOM);
        setAmount(coin.amount);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error fetching Onomy balance', e);
      }
    }

    updateBalance();
    const interval = setInterval(updateBalance, POLLING_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stargate]);

  const connectKeplr = useCallback(async () => {
    const chainId = 'ochain-testnet';
    try {
      if (window.keplr) {
        await window.keplr.experimentalSuggestChain({
          // Chain-id of the Cosmos SDK chain.
          chainId: chainId,
          // The name of the chain to be displayed to the user.
          chainName: 'Onomy',
          // RPC endpoint of the chain.
          rpc: `${window.location.origin}/keplr_rpc`,
          // REST endpoint of the chain.
          rest: `${window.location.origin}/keplr_rest`,
          stakeCurrency: {
            // Coin denomination to be displayed to the user.
            coinDenom: 'NOM',
            // Actual denom (i.e. uatom, uscrt) used by the blockchain.
            coinMinimalDenom: 'unom',
            // # of decimal points to convert minimal denomination to user-facing denomination.
            coinDecimals: 6,
            // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
            // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
            // coinGeckoId: ""
          },
          bip44: {
            coinType: 118,
          },
          bech32Config: {
            bech32PrefixAccAddr: 'onomy',
            bech32PrefixAccPub: 'onomypub',
            bech32PrefixValAddr: 'onomyvaloper',
            bech32PrefixValPub: 'onomyvaloperpub',
            bech32PrefixConsAddr: 'onomyvalcons',
            bech32PrefixConsPub: 'onomyvalconspub',
          },
          currencies: [
            {
              coinDenom: 'NOM',
              coinMinimalDenom: 'unom',
              coinDecimals: 6,
            },
          ],
          feeCurrencies: [
            {
              coinDenom: 'NOM',
              coinMinimalDenom: 'unom',
              coinDecimals: 6,
            },
          ],
          coinType: 118,
          gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.04,
          },
        });
        // Staking coin information
        await window.keplr.enable(chainId);
        if (!window.getOfflineSigner) throw new Error('No Offline Signer');
        const offlineSigner = window.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        console.log('kepler accounts', accounts);
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

  useEffect(() => {
    // Wait for kepler load
    const interval = setInterval(() => {
      if (window.keplr) {
        connectKeplr();
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { address, amount, setAddress };
}

export type OnomyState = ReturnType<typeof useOnomyState>;

const DEFAULT_STATE: OnomyState = {
  address: '',
  amount: '0',
  setAddress: () => {},
};

const OnomyContext = createContext(DEFAULT_STATE);

export function useOnomy() {
  return useContext(OnomyContext);
}

export function OnomyProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const state = useOnomyState();

  return <OnomyContext.Provider value={state}>{children}</OnomyContext.Provider>;
}
