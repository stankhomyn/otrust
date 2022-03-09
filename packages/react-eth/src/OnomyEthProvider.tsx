import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BigNumber } from 'bignumber.js';

import { BondingCont, GravityCont, NOMCont } from './contracts';

const DEFAULT_STATE = {
  blockNumber: new BigNumber(0),
  currentETHPrice: new BigNumber(0),
  currentNOMPrice: new BigNumber(0),
  NOMallowance: new BigNumber(0),
  strongBalance: new BigNumber(0),
  supplyNOM: new BigNumber(0),
  weakBalance: new BigNumber(0),
};

function convertBigNum(bigNum: BigNumber) {
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
  const { account, library } = useWeb3React();
  const [state, setState] = useState(DEFAULT_STATE);

  const bondContract = useMemo(
    () => BondingCont(library, bondContractAddress),
    [bondContractAddress, library]
  );

  const NOMContract = useMemo(
    () => NOMCont(library, nomContractAddress),
    [library, nomContractAddress]
  );

  const gravityContract = useMemo(
    () => GravityCont(library, gravityContractAddress),
    [gravityContractAddress, library]
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
            NOMContract.allowance(account, bondContractAddress).then(convertBigNum),
            // Strong Balance
            library.getBalance(account).then(convertBigNum),
            // Supply NOM
            bondContract.getSupplyNOM().then(convertBigNum),
            // Weak Balance (May need to move these to Exchange)
            NOMContract.balanceOf(account).then(convertBigNum),
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

    library.on('block', onBlock);
    // remove listener when the component is unmounted
    return () => {
      library.removeListener('block', onBlock);
    };
  }, [NOMContract, account, bondContract, bondContractAddress, library, state.blockNumber]);

  return {
    ...state,
    bondContract,
    NOMContract,
    gravityContract,
  };
}

type OnomyEthContextType = ReturnType<typeof useOnomyEthState>;

export const OnomyEthContext = createContext<OnomyEthContextType>(
  DEFAULT_STATE as unknown as OnomyEthContextType
);
export const useOnomyEth = () => useContext(OnomyEthContext);

export function OnomyEthProvider({
  children,
  graphQlEndpoint,
  nomContractAddress,
  bondContractAddress,
  gravityContractAddress,
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
      <OnomyEthContext.Provider
        value={useOnomyEthState({
          nomContractAddress,
          bondContractAddress,
          gravityContractAddress,
        })}
      >
        {children}
      </OnomyEthContext.Provider>
    </ApolloProvider>
  );
}
