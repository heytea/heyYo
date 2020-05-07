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