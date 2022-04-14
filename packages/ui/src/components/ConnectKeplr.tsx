import React, { useEffect } from 'react';
import { useWallet } from '@onomy/react-wallet';

export function ConnectKeplr() {
  const { onomy } = useWallet();

  useEffect(() => {
    onomy.connect();
  }, [onomy]);

  return <></>;
}
