import { useCallback, useEffect, useRef, useState } from 'react';

type NewStateFunction<T> = (newState: T) => T;
type NewState<T> = T | NewStateFunction<T>;
type UpdateState<T> = (
  newState: NewState<T>,
  callback?: (state: T) => void,
) => void;

function isCallback<T, F>(maybeFunction: T | F): maybeFunction is F {
  return typeof maybeFunction === 'function';
}

export function useStateWithCallback<T>(
  initialState: T,
): [T, UpdateState<T>] {
  const [state, setState] = useState<T>(initialState);
  const callbackRef = useRef<(state: T) => void>();

  const updateState = useCallback<UpdateState<T>>((newState, callback) => {
    callbackRef.current = callback;

    setState((prev) => {
      if (isCallback<T, NewStateFunction<T>>(newState)) {
        return newState(prev);
      }

      return newState;
    });
  }, []);

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = undefined;
    }
  }, [state]);

  return [state, updateState];
}