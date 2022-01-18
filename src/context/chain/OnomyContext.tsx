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

import { useStateRef } from 'hooks/useStateRef';
import {
  KEPLR_CONFIG,
  REACT_APP_ONOMY_REST_URL,
  REACT_APP_ONOMY_WS_URL,
  DENOM,
} from 'constants/env';
// eslint-disable-next-line import/no-cycle
import { ChainContext } from './ChainContext';
import { format18 } from 'utils/math';
import { OnomyClient } from 'OnomyClient';
import { useKeplr } from 'hooks/useKeplr';

// This is lame, but can't find a way to subscribe to cosmos events
const POLLING_INTERVAL = 1000;
const BLOCKS_TO_WAIT_FOR_BRIDGE = new BigNumber(14);

type BridgeTransactionInProgress = {
  startBalance: BigNumber;
  startEthBlock: BigNumber;
  expectedIncrease: BigNumber;
};

function useOnomyState() {
  const { blockNumber } = useContext<{ blockNumber: BigNumber }>(ChainContext);
  const blockNumRef = useRef(blockNumber);
  const onomyClient = useMemo(() => {
    return new OnomyClient(REACT_APP_ONOMY_REST_URL, REACT_APP_ONOMY_WS_URL);
  }, []);

  blockNumRef.current = blockNumber;
  const [address, setAddress, addressRef] = useStateRef('');
  const [amount, setAmount, amountRef] = useStateRef('0');
  const [bridgeTransactions, setBridgeTransactions] = useState<BridgeTransactionInProgress[]>([]);
  const [bridgedSupply, setBridgedSupply] = useState(new BigNumber(0));

  const bridgedSupplyFormatted = useMemo(() => {
    if (!bridgedSupply) return 0;
    const formated = format18(bridgedSupply);
    return formated.toNumber();
  }, [bridgedSupply]);

  const { address: keplrAddress, hasKeplr, connect: connectKeplr } = useKeplr(KEPLR_CONFIG);
  useEffect(() => {
    if (keplrAddress) setAddress(keplrAddress);
  }, [keplrAddress, setAddress]);

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

  useEffect(() => {
    async function updateBalance() {
      if (!addressRef.current) return;
      try {
        setAmount(await onomyClient.getAddressBalance(addressRef.current, DENOM));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error fetching Onomy balance', e);
      }
    }

    updateBalance();
    const interval = setInterval(updateBalance, POLLING_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBridgedSupply = useCallback(
    async () => setBridgedSupply(await onomyClient.getAnomSupply()),
    [onomyClient]
  );

  useEffect(() => {
    updateBridgedSupply();
    const interval = setInterval(() => updateBridgedSupply(), POLLING_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    address,
    amount,
    bridgedSupplyFormatted,
    bridgeProgress,
    hasKeplr,
    setAddress,
    addPendingBridgeTransaction,
    connectKeplr,
  };
}

export type OnomyState = ReturnType<typeof useOnomyState>;

const DEFAULT_STATE: OnomyState = {
  address: '',
  amount: '0',
  bridgedSupplyFormatted: 0,
  bridgeProgress: null,
  hasKeplr: false,
  connectKeplr: () => Promise.resolve(),
  setAddress: () => {},
  addPendingBridgeTransaction: () => {},
};

const OnomyContext = createContext(DEFAULT_STATE);

export function useOnomy() {
  const context = useContext(OnomyContext);
  context.connectKeplr();
  return context;
}

export function OnomyProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const state = useOnomyState();

  return <OnomyContext.Provider value={state}>{children}</OnomyContext.Provider>;
}
