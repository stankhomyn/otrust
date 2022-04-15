import React from 'react';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';

function getWeb3Library(provider: ExternalProvider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export function EthWeb3Provider({ children }: { children: JSX.Element | JSX.Element[] }) {
  return <Web3ReactProvider getLibrary={getWeb3Library}>{children}</Web3ReactProvider>;
}

export { useWeb3React as useEthWeb3 } from '@web3-react/core';
