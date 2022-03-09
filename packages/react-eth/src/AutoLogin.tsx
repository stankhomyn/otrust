import React, { useEffect } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AbstractConnector } from '@web3-react/abstract-connector';

import { useEagerConnect } from './useEagerConnect';
import { useInactiveListener } from './useInactiveListener';

export function AutoLogin({
  children,
  Landing,
}: {
  children: JSX.Element | JSX.Element[];
  Landing: React.ComponentType<{ connectWallet: (con: AbstractConnector) => void }>;
}) {
  const { activate, active, connector } = useWeb3React();

  const connectWallet = (con: AbstractConnector) => {
    try {
      activate(con, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(con);
        } else {
          // setPendingError(true)
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Failed to connect.');
    }
  };

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // mount only once or face issues :P
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);

  return <>{active ? children : <Landing connectWallet={connectWallet} />}</>;
}
