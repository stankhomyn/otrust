import React, { useEffect } from 'react';
import { useOnomy } from '@onomy/react-client';

export function ConnectKeplr() {
  const { connectKeplr } = useOnomy();

  useEffect(() => {
    connectKeplr();
  }, [connectKeplr]);

  return <></>;
}
