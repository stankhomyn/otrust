import React, { useEffect } from 'react';

import { useOnomy } from 'context/chain/OnomyContext';

export function ConnectKeplr() {
  const { connectKeplr } = useOnomy();

  useEffect(() => {
    connectKeplr();
  }, [connectKeplr]);

  return <></>;
}
