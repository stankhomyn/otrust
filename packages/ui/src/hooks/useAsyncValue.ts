import { useEffect } from 'react';

import { AsyncStatus, useAsyncProcess } from './useAsyncProcess';
import { useStateRef } from './useStateRef';

export function useAsyncValue<T, U>(
  fn: () => Promise<T>,
  defVal: U
): [T | U, AsyncStatus, React.MutableRefObject<T | U>] {
  const [value, setValue, valueRef] = useStateRef<T | U>(defVal);
  const [run, state] = useAsyncProcess({ allowMultiple: true });

  useEffect(() => {
    run(async () => setValue(await fn()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, run]);

  return [value, state, valueRef];
}
