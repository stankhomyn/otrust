import { useCallback, useEffect, useState } from 'react';

import { AsyncStatus } from './useAsyncProcess';
import { useAsyncValue } from './useAsyncValue';

export function useAsyncPoll<T, U>(
  fn: () => Promise<T>,
  defVal: U,
  pollInterval = 2000
): [T | U, AsyncStatus] {
  const [counter, setCounter] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cb = useCallback(() => fn(), [fn, counter]);

  useEffect(() => {
    const interval = setInterval(() => setCounter(x => x + 1), pollInterval);
    return () => clearInterval(interval);
  }, [pollInterval]);

  const [value, state] = useAsyncValue(cb, defVal);
  const [currentState, setCurrentState] = useState<AsyncStatus>(state);

  useEffect(() => {
    if (state.error || state.finished) {
      setCurrentState(state);
    }
  }, [state]);

  return [value, currentState];
}
