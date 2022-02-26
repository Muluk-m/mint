import { useReducer, useRef, useEffect, useState } from 'react';
import type { useEffect as useEffectType, DependencyList, EffectCallback } from 'react';
import isEqual from 'lodash/isEqual';

export const useSet = <T = any>(initState: T): [T, React.Dispatch<T>] => {
  const [state, setState] = useReducer((state: T, newState: T) => {
    let action = newState;
    if (typeof action === 'function') {
      action = action(state);
    }
    // if (action.action && action.payload) {
    //   action = newState.payload;
    //   if (typeof action === 'function') {
    //     action = action(state);
    //   }
    // }
    const result = { ...state, ...action };
    if (process.env.NODE_ENV === 'development') {
      // console.group(newState.action || 'action');
      // console.log('%cState:', 'color: #9E9E9E; font-weight: 700;', state);
      // console.log('%cAction:', 'color: #00A7F7; font-weight: 700;', action);
      // console.log('%cNext:', 'color: #47B04B; font-weight: 700;', result);
      // console.groupEnd();
    }
    return result;
  }, initState);
  return [state, setState];
};

export function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export const useModal = () => {
  const [show, setShow] = useState(false);
  const toggle = () => setShow((show) => !show);
  return [show, toggle] as [boolean, typeof toggle];
};

export const useStorageState = (initState = {}, searchKey = 'SAVES') => {
  const readSearchFromStorage = () => {
    const searchStr = localStorage.getItem(searchKey);
    if (searchStr) {
      try {
        return JSON.parse(searchStr);
      } catch {
        return initState;
      }
    }
    return initState;
  };
  const [data, setData] = useState(readSearchFromStorage());
  const setSearchWithStorage = (search: Record<string | number, any>) => {
    setData(search);
    localStorage.setItem(searchKey, JSON.stringify(search));
  };
  return [data, setSearchWithStorage] as [typeof data, typeof setSearchWithStorage];
};

export const useUpdateEffect: typeof useEffectType = (effect, deps) => {
  const isMounted = useRef(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

const depsEqual = (aDeps: DependencyList, bDeps: DependencyList = []) => {
  return isEqual(aDeps, bDeps);
};

export const useDeepCompareEffect = (effect: EffectCallback, deps: DependencyList) => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);

  if (!depsEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [signalRef.current]);
};
