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
import { useAsyncPoll } from '@onomy/react-utils';
import { OnomyClient, OnomyConstants } from '@onomy/client';
import { useWallet } from '@onomy/react-wallet';

type BridgeTransactionInProgress = {
  startBalance: BigNumber;
  startEthBlock: BigNumber;
  expectedIncrease: BigNumber;
};

function useOnomyState({
  rpcUrl,
  ethBlockNumber = new BigNumber(0),
}: {
  rpcUrl: string;
  ethBlockNumber?: BigNumber;
}) {
  const blockNumRef = useRef(ethBlockNumber);
  const onomyClient = useMemo(() => new OnomyClient(rpcUrl), [rpcUrl]);
  const { onomySigner } = useWallet();
  blockNumRef.current = ethBlockNumber;
  const [address, setAddress] = useState('');
  const [amount, , amountRef] = useAsyncPoll(
    useCallback(async () => {
      if (!address) return '0';
      return onomyClient.getAddressBalance(address, OnomyConstants.DENOM);
    }, [onomyClient, address]),
    '0'
  );
  const [bridgeTransactions, setBridgeTransactions] = useState<BridgeTransactionInProgress[]>([]);

  useEffect(() => {
    if (!onomySigner) return;
    (async () => {
      const accounts = await onomySigner.getAccounts();
      const [{ address: addr = '' } = {}] = accounts;
      if (addr) setAddress(addr);
    })();
  }, [onomySigner]);

  useEffect(() => {
    onomyClient.setSigner(onomySigner);
  }, [onomySigner, onomyClient]);

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
    const expectedEndBlock = lastStartBlock.plus(OnomyConstants.ETH_BRIDGE_WAIT_BLOCKS);
    const progressBlocks = ethBlockNumber.minus(startEthBlock);
    const totalBlocks = expectedEndBlock.minus(startEthBlock);
    const progress = progressBlocks.dividedBy(totalBlocks).multipliedBy(100).toNumber();
    return Math.min(progress, 100);
  }, [ethBlockNumber, bridgeTransactions]);

  return {
    address,
    onomyClient,
    amount,
    bridgeProgress,
    setAddress,
    addPendingBridgeTransaction,
  };
}

export type OnomyState = ReturnType<typeof useOnomyState>;

const DEFAULT_STATE: OnomyState = {
  onomyClient: new OnomyClient(''),
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

export function OnomyProvider({
  rpcUrl,
  children,
  ethBlockNumber = new BigNumber(0),
}: {
  rpcUrl: string;
  children: JSX.Element | JSX.Element[];
  ethBlockNumber?: BigNumber;
}) {
  const state = useOnomyState({ rpcUrl, ethBlockNumber });

  return <OnomyContext.Provider value={state}>{children}</OnomyContext.Provider>;
}
