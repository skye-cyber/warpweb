import { RootState } from './index';

const STORAGE_KEY = 'warp_app_state';

// Load state from localStorage
export const loadState = (): Partial<RootState> | undefined => {
    try {
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading state from localStorage:', err);
        return undefined;
    }
};

// Save state to localStorage
export const saveState = (state: RootState): void => {
    try {
        // Only save specific parts of the state if needed
        const stateToSave = {
            warp: {
                activeTool: state.warp.activeTool,
                ui: state.warp.ui,
                // Don't save loading, error, successMessage as they're temporary
            },
        };
        const serializedState = JSON.stringify(stateToSave);
        localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (err) {
        console.error('Error saving state to localStorage:', err);
    }
};

// Clear state from localStorage
export const clearState = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.error('Error clearing state from localStorage:', err);
    }
};
