import { useCallback, useEffect, useState } from 'react';

import { AsyncStatus } from './useAsyncProcess';
import { useAsyncValue } from './useAsyncValue';

export function useAsyncPoll<T, U>(
  fn: () => Promise<T>,
  defVal: U,
  pollInterval = 2000
): [T | U, AsyncStatus, React.MutableRefObject<T | U>] {
  const [counter, setCounter] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cb = useCallback(() => fn(), [fn, counter]);

  useEffect(() => {
    const interval = setInterval(() => setCounter(x => x + 1), pollInterval);
    return () => clearInterval(interval);
  }, [pollInterval]);

  const [value, state, valRef] = useAsyncValue(cb, defVal);
  const [currentState, setCurrentState] = useState<AsyncStatus>(state);

  useEffect(() => {
    if (currentState.finished) {
      if (state.error || state.finished) {
        setCurrentState(state);
      }
    } else {
      setCurrentState(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return [value, currentState, valRef];
}
