/**
 * Configure and create the Redux store
 */
import { configureStore } from '@reduxjs/toolkit';
import warpSlice, { WarpState } from './warpSlice';
import { loadState, saveState } from './localStorage';

// Define the root state type
export interface RootState {
    warp: WarpState;
}

// Define the store type
export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = AppStore['dispatch'];

// Get environment variables safely
const isDev = import.meta.env.DEV;

// Create the store
export const store = configureStore({
    reducer: {
        warp: warpSlice,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: {
            // Ignore specific action types that might have non-serializable data
            ignoredActions: ['warp/setWarp', 'warp/updateWarp', 'warp/resetWarp'],
            // Ignore specific paths in the state
            ignoredPaths: ['warp.warp', 'warp.activeTool'],
            // Warn if non-serializable values are found
            warnAfter: 100,
        },
        // Add other middleware options if needed
        immutableCheck: {
            warnAfter: 100,
        },
    }),
    devTools: isDev,
    preloadedState: loadState(),
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
    const state = store.getState();
    saveState(state as RootState);
});

// Optional: Type-safe hooks
export type AppThunk = (dispatch: AppDispatch, getState: () => RootState) => void;

// Export the store for use in the application
export default store;
