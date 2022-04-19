import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';

function getWeb3Library(provider: providers.ExternalProvider) {
  const library = new providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export function EthWeb3Provider({ children }: { children: JSX.Element | JSX.Element[] }) {
  return <Web3ReactProvider getLibrary={getWeb3Library}>{children}</Web3ReactProvider>;
}

export { useWeb3React } from '@web3-react/core';
