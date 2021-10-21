import { AccountData, OfflineSigner, SigningCosmosClient } from '@cosmjs/launchpad';
import { Keplr } from '@keplr-wallet/types';
import { useCallback, useEffect, useState } from 'react';

type KeplrUtils = {
  keplr: Keplr;
  offlineSigner: OfflineSigner;
  accounts: readonly AccountData[];
};

export function useKeplr() {
  const [state, setState] = useState<KeplrUtils | null>(null);
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
          rpc: 'http://64.227.98.168:26657',
          // REST endpoint of the chain.
          rest: 'http://64.227.98.168:9091',
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
        (async () => {
          try {
            const cosmJS = new SigningCosmosClient(
              'https://lcd-cosmoshub.keplr.app/rest',
              accounts[0].address,
              offlineSigner
            );
            const ca = await cosmJS.getAccount(accounts[0].address);
            // eslint-disable-next-line no-console
            console.log('balance', ca?.balance);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Error fetching keplr balance', e);
          }
        })();
        setState({ keplr: window.keplr, offlineSigner, accounts });
      } else {
        // eslint-disable-next-line no-console
        console.error('Install keplr chrome extension');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('keplr error', e);
    }
  }, []);

  useEffect(() => {
    connectKeplr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
