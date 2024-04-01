import { DeepSignal, deepSignal, shallow } from 'deepsignal'
import { createContext } from 'preact'
import { useContext, useMemo } from 'preact/hooks'

const bindAll = <T extends Record<PropertyKey, Factory<any>>>(slices: T) => {
  return Object.fromEntries(
    Object.entries(slices).map(([sliceKey, sliceValue]) => [sliceKey, shallow(sliceValue) as any])
  )
}

// prettier-ignore
export type Factory<T> = { [K in keyof T as K extends `$${string}` ? never : K]: T[K] extends Record<PropertyKey, unknown> ? Factory<T[K]> : T[K] }
export const useStoreFactory = <T extends Record<PropertyKey, Factory<any>>>(slices: T) => {
  const StoreContext = createContext(null as never as Factory<T>)
  return {
    useCreateStore: () => useMemo(() => deepSignal(bindAll(slices)), []) as Factory<T>,
    useStore: () => useContext(StoreContext),
    StoreContext,
  }
}

// prettier-ignore
type ArgumentType<S, T> = {[K in keyof T as K extends `$${infer s}` ? s extends keyof S ? S[s] extends (...args:never)=>void ? never : K : K : K]-?: T[K]}

// prettier-ignore
export const slice = <T extends Record<PropertyKey, unknown>>(
  args: T & {[K in keyof T]: T[K] extends (...args: never) => unknown ? (this: ArgumentType<T, DeepSignal<T>>, ...args: never) => unknown : T[K]}
) => {
  const result = deepSignal({})
  Object.defineProperties(result, Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(args)).map(([key, item]) => (
    [key, item.get ? {...item, get: item.get.bind(result)} : typeof item.value === 'function' ? {...item, value: item.value.bind(result)} : item]
  ))))
  return result as Factory<T>
}
