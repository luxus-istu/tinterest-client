import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, AppStore, RootState } from './store'

/**
 * Use these typed hooks throughout your app instead of plain `useDispatch` and `useSelector`.
 * This ensures type safety for the global store state and dispatch.
 */

const dispatch = useDispatch.withTypes<AppDispatch>;
const selector = useSelector.withTypes<RootState>;
const store = useStore.withTypes<AppStore>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>;
export const useAppSelector = useSelector.withTypes<RootState>;
export const useAppStore = useStore.withTypes<AppStore>;
