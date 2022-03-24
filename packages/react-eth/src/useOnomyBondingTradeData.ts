import { useApolloClient } from '@apollo/client';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';

import { OnomyBondingTradeData } from './OnomyBondingTradeData';

export function useOnomyBondingTradeData() {
  const { library } = useWeb3React();
  try {
    const apolloClient = useApolloClient();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => {
      if (!apolloClient) return null;
      return new OnomyBondingTradeData(apolloClient, library);
    }, [library, apolloClient]);
  } catch {
    // Occurs in testing
    return null;
  }
}
