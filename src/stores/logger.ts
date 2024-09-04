import type { StoreApi } from 'zustand'

type GetState<T> = StoreApi<T>['getState']
type SetState<T> = StoreApi<T>['setState']

type ConfigFn<T extends object> = (
  set: SetState<T>,
  get: GetState<T>,
  api: StoreApi<T>
) => T

const enableLogging = import.meta.env.DEV

export const loggerMiddleware =
  <T extends object>(config: ConfigFn<T>) =>
  (set: SetState<T>, get: GetState<T>, api: StoreApi<T>) =>
    config(
      args => {
        if (enableLogging) {
          const prevState = get()
          console.groupCollapsed(
            `%cZustand Action @ ${new Date().toLocaleTimeString()}`,
            'font-weight: bold;'
          )
          console.log(
            '%cprev state',
            'color: #9E9E9E; font-weight: bold;',
            prevState
          )
          console.log(
            '%caction    ',
            'color: #03A9F4; font-weight: bold;',
            args
          )
          set(args)
          const nextState = get()
          console.log(
            '%cnext state',
            'color: #4CAF50; font-weight: bold;',
            nextState
          )
          console.groupEnd()
        } else {
          set(args)
        }
      },
      get,
      api
    )
