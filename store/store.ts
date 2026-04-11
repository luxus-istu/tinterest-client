import { configureStore } from '@reduxjs/toolkit'

/**
 * Creates a new Redux store instance for each request or the client.
 * Using a factory function prevents cross-request state leakage in SSR environments.
 */
export const makeStore = () => {
  return configureStore({
    reducer: {
      // TODO: Add slices here
      // ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Often needed for some premium UI interactions/libraries
      }),
  })
}

// Infer relevant types from the store factory
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
