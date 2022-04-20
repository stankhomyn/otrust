/* eslint-disable react/require-default-props */
import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BigNumber } from 'bignumber.js';
import { useAsyncValue } from '@onomy/react-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useWallet } from '@onomy/react-wallet';

import { BondingCont, GravityCont, NOMCont } from './contracts';
import { NomBondingCurve } from './NomBondingCurve';

const DEFAULT_STATE = {
  blockNumber: new BigNumber(0),
  currentETHPrice: new BigNumber(0),
  currentNOMPrice: new BigNumber(0),
  NOMallowance: new BigNumber(0),
  strongBalance: new BigNumber(0),
  supplyNOM: new BigNumber(0),
  weakBalance: new BigNumber(0),
};

function convertBigNum(bigNum: { toString: () => BigNumber.Value }) {
  // Needed due to mixed BigNumber versions
  return new BigNumber(bigNum.toString());
}

function useOnomyEthState({
  nomContractAddress,
  bondContractAddress,
  gravityContractAddress,
}: {
  nomContractAddress: string;
  bondContractAddress: string;
  gravityContractAddress: string;
}) {
  const { ethereumSigner: signer, ethereumProvider: provider } = useWallet();

  const [state, setState] = useState(DEFAULT_STATE);
  const active = !!signer; // TODO: this may not be right?

  const [address] = useAsyncValue(
    useCallback(async () => signer?.getAddress() ?? '', [signer]),
    ''
  );

  // @ts-ignore
  const logout: () => void = provider?.deactivate; // TODO: figure out deactivate

  const bondContract = useMemo(
    () => BondingCont(bondContractAddress, signer ?? undefined),
    [bondContractAddress, signer]
  );

  const NOMContract = useMemo(
    () => NOMCont(nomContractAddress, signer ?? undefined),
    [nomContractAddress, signer]
  );

  const gravityContract = useMemo(
    () => GravityCont(gravityContractAddress, signer ?? undefined),
    [gravityContractAddress, signer]
  );

  const bondingCurve = useMemo(
    () => new NomBondingCurve(bondContract, NOMContract, gravityContract),
    [bondContract, NOMContract, gravityContract]
  );

  useEffect(() => {
    // listen for changes on an Ethereum address
    async function onBlock(bNumber: number) {
      const blockNumber = new BigNumber(bNumber);
      if (state.blockNumber === blockNumber) return;
      try {
        const [currentETHPrice, NOMallowance, strongBalance, supplyNOM, weakBalance] =
          await Promise.all([
            // Current ETH Price & Current NOM Price
            bondContract.buyQuoteETH((10 ** 18).toString()).then(convertBigNum),
            // NOM Allowance
            NOMContract.allowance(address, bondContractAddress).then(convertBigNum),
            // Strong Balance
            provider?.getBalance(address).then(convertBigNum) ?? Promise.resolve(new BigNumber(0)),
            // Supply NOM
            bondContract.getSupplyNOM().then(convertBigNum),
            // Weak Balance (May need to move these to Exchange)
            NOMContract.balanceOf(address).then(convertBigNum),
            // UniSwap Pricing
            // UniSwapCont.getReserves(),
          ]);
        const currentNOMPrice = new BigNumber(1).div(currentETHPrice);

        setState({
          blockNumber,
          currentETHPrice,
          currentNOMPrice,
          NOMallowance,
          strongBalance,
          supplyNOM,
          weakBalance,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed Chain Promise', e);
      }
    }

    if (provider) provider.on('block', onBlock);
    // remove listener when the component is unmounted
    return () => {
      if (provider) provider.removeListener('block', onBlock);
    };
  }, [NOMContract, address, bondContract, bondContractAddress, provider, state.blockNumber]);

  return {
    ...state,
    provider,
    active,
    address,
    bondingCurve,
    bondContract,
    NOMContract,
    gravityContract,
    logout,
  };
}

type OnomyEthContextType = ReturnType<typeof useOnomyEthState>;

export const OnomyEthContext = createContext<OnomyEthContextType>(
  DEFAULT_STATE as unknown as OnomyEthContextType
);
export const useOnomyEth = () => useContext(OnomyEthContext);

function OnomyEthProviderInner({
  children,
  nomContractAddress,
  bondContractAddress,
  gravityContractAddress,
}: {
  children: JSX.Element | JSX.Element[];
  nomContractAddress: string;
  bondContractAddress: string;
  gravityContractAddress: string;
}) {
  return (
    <OnomyEthContext.Provider
      value={useOnomyEthState({
        nomContractAddress,
        bondContractAddress,
        gravityContractAddress,
      })}
    >
      {children}
    </OnomyEthContext.Provider>
  );
}

export function OnomyEthProvider({
  children,
  graphQlEndpoint,
  ...props
}: {
  children: JSX.Element | JSX.Element[];
  graphQlEndpoint: string;
  nomContractAddress: string;
  bondContractAddress: string;
  gravityContractAddress: string;
}) {
  const client = useMemo(
    () =>
      new ApolloClient({
        uri: graphQlEndpoint,
        cache: new InMemoryCache(),
      }),
    [graphQlEndpoint]
  );

  return (
    <ApolloProvider client={client}>
      <OnomyEthProviderInner {...props}>{children}</OnomyEthProviderInner>
    </ApolloProvider>
  );
}
