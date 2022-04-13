import React, { useEffect } from 'react';
import { useWallet } from '@onomy/react-client';

export function ConnectKeplr() {
  const { onomy } = useWallet();

  useEffect(() => {
    onomy.connect();
  }, [onomy]);

  return <></>;
}
