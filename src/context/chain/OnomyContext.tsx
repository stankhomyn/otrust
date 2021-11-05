import { StargateClient } from '@cosmjs/stargate';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BigNumber } from 'bignumber.js';

import { useAsyncValue } from 'hooks/useAsyncValue';
import { useStateRef } from 'hooks/useStateRef';
import { COSMOS_WS, KEPLR_REST, KEPLR_RPC } from 'constants/env';
// eslint-disable-next-line import/no-cycle
import { ChainContext } from './ChainContext';

// This is lame, but can't find a way to subscribe to cosmos events
const POLLING_INTERVAL = 1000;
const DENOM = 'anom';
const BLOCKS_TO_WAIT_FOR_BRIDGE = new BigNumber(14);

type BridgeTransactionInProgress = {
  startBalance: BigNumber;
  startEthBlock: BigNumber;
  expectedIncrease: BigNumber;
};

function useOnomyState() {
  const { blockNumber } = useContext<{ blockNumber: BigNumber }>(ChainContext);
  const blockNumRef = useRef(blockNumber);
  blockNumRef.current = blockNumber;
  const [address, setAddress, addressRef] = useStateRef('');
  const [amount, setAmount, amountRef] = useStateRef('0');
  const [bridgeTransactions, setBridgeTransactions] = useState<BridgeTransactionInProgress[]>([]);

  const addPendingBridgeTransaction = useCallback((expectedIncrease: BigNumber) => {
    const transaction = {
      startBalance: new BigNumber(amountRef.current),
      startEthBlock: blockNumRef.current,
      expectedIncrease,
    };
    setBridgeTransactions(t => [...t, transaction]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Clear any pending transactions that appear to have been processed
    const curBalance = new BigNumber(amount);
    const clearedTransactions = bridgeTransactions.filter(({ startBalance, expectedIncrease }) => {
      const expectedBalance = startBalance.plus(expectedIncrease);
      return curBalance.isGreaterThanOrEqualTo(expectedBalance);
    });
    setBridgeTransactions(pending => pending.filter(t => clearedTransactions.indexOf(t) === -1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const bridgeProgress = useMemo(() => {
    if (bridgeTransactions.length === 0) return null;
    const [{ startEthBlock }] = bridgeTransactions;
    const { startEthBlock: lastStartBlock } = bridgeTransactions.slice().pop()!;
    const expectedEndBlock = lastStartBlock.plus(BLOCKS_TO_WAIT_FOR_BRIDGE);
    const progressBlocks = blockNumber.minus(startEthBlock);
    const totalBlocks = expectedEndBlock.minus(startEthBlock);
    const progress = progressBlocks.dividedBy(totalBlocks).multipliedBy(100).toNumber();
    return Math.min(progress, 100);
  }, [blockNumber, bridgeTransactions]);

  const [stargate] = useAsyncValue(
    // useCallback(() => StargateClient.connect(`wss://${window.location.hostname}/tendermint`), []),
    useCallback(() => StargateClient.connect(COSMOS_WS), []),
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
          rpc: KEPLR_RPC,
          // REST endpoint of the chain.
          rest: KEPLR_REST,
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
        setAddress(() => accounts[0].address);

        /*
        const tmclient = await Tendermint34Client.connect(COSMOS_WS);
        const txQuery = buildQuery({
          tags: [
            {
              key: 'action',
              value: 'send_to_cosmos_claim',
            },
          ],
        });
        const stream = tmclient.subscribeTx(txQuery);
        const stream = tmclient.subscribeNewBlock();
        stream.addListener({
          next: evt => console.log('tendermint-rpc', evt),
          error: err => console.error('tendermint error', err),
          complete: () => console.log('tendermint-rpc complete'),
        });
        */
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

  return { address, amount, bridgeProgress, setAddress, addPendingBridgeTransaction };
}

export type OnomyState = ReturnType<typeof useOnomyState>;

const DEFAULT_STATE: OnomyState = {
  address: '',
  amount: '0',
  bridgeProgress: null,
  setAddress: () => {},
  addPendingBridgeTransaction: () => {},
};

const OnomyContext = createContext(DEFAULT_STATE);

export function useOnomy() {
  return useContext(OnomyContext);
}

export function OnomyProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const state = useOnomyState();

  return <OnomyContext.Provider value={state}>{children}</OnomyContext.Provider>;
}
