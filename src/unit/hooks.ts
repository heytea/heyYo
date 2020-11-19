import { useRef, useEffect, EffectCallback, DependencyList } from 'react'

export function useUpdateEffect(effect: EffectCallback, dependencies?: DependencyList) {
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      effect()
    }
  }, dependencies)
}

export function useUnmount(fn: any) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(
    () => () => {
      if (fnRef.current && typeof fnRef.current === 'function') {
        fnRef.current();
      }
    },
    [],
  );
};
