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
import { useKeplr } from '@onomy/react-keplr';
import { OnomyClient, OnomyConstants } from '@onomy/client';

type BridgeTransactionInProgress = {
  startBalance: BigNumber;
  startEthBlock: BigNumber;
  expectedIncrease: BigNumber;
};

type ChainInfo = Parameters<typeof useKeplr>[0];

function useOnomyState({
  chainInfo,
  ethBlockNumber = new BigNumber(0),
}: {
  chainInfo: ChainInfo;
  ethBlockNumber?: BigNumber;
}) {
  const blockNumRef = useRef(ethBlockNumber);
  const onomyClient = useMemo(() => new OnomyClient(chainInfo.rpc), [chainInfo.rpc]);

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
  const { address: keplrAddress, hasKeplr, connect: connectKeplr, signer } = useKeplr(chainInfo);

  useEffect(() => {
    if (keplrAddress) setAddress(keplrAddress);
  }, [keplrAddress, setAddress]);

  useEffect(() => {
    onomyClient.setSigner(signer);
  }, [signer, onomyClient]);

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
    hasKeplr,
    setAddress,
    addPendingBridgeTransaction,
    connectKeplr,
  };
}

export type OnomyState = ReturnType<typeof useOnomyState>;

const DEFAULT_STATE: OnomyState = {
  onomyClient: new OnomyClient(''),
  address: '',
  amount: '0',
  bridgeProgress: null,
  hasKeplr: false,
  connectKeplr: () => Promise.resolve(),
  setAddress: () => {},
  addPendingBridgeTransaction: () => {},
};

const OnomyContext = createContext(DEFAULT_STATE);

export function useOnomy() {
  const context = useContext(OnomyContext);
  // context.connectKeplr();
  return context;
}

export function OnomyProvider({
  chainInfo,
  children,
  ethBlockNumber = new BigNumber(0),
}: {
  chainInfo: ChainInfo;
  children: JSX.Element | JSX.Element[];
  ethBlockNumber?: BigNumber;
}) {
  const state = useOnomyState({ chainInfo, ethBlockNumber });

  return <OnomyContext.Provider value={state}>{children}</OnomyContext.Provider>;
}
