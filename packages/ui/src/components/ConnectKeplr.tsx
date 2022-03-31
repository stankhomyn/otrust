import React, { useEffect } from 'react';
import { useKeplr } from '@onomy/react-keplr';

export function ConnectKeplr() {
  const { connect } = useKeplr();

  useEffect(() => {
    connect();
  }, [connect]);

  return <></>;
}
