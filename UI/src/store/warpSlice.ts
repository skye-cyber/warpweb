/**
 * Warp Slice
 *
 * Redux slice for managing warp data and application state
 */

import { createSlice, UnknownAction } from '@reduxjs/toolkit';
import { Reducer } from 'react';

interface Tool {
    category: string,
    id: number | string | null,
    name: string
}

interface UI {
    activeTab: string,
    panelWidth: number,
    isDragging: boolean,
    zoomLevel: number,
}

export interface WarpState {
    warp: Record<any, any>
    loading: boolean
    error: string | null
    successMessage: string | null | undefined
    activeTool: Tool
    ui: UI
}
/**
 * Initial state for the warp slice
 */
const initialState: WarpState = {
    warp: {},
    loading: false,
    error: null,
    successMessage: null,
    activeTool: { category: 'dashboard', id: 1, name: 'Dashboard' },
    ui: {
        activeTab: 'dashboard',
        panelWidth: 350,
        isDragging: false,
        zoomLevel: 100,
    }
};

/**
 * Create the warp slice
 */
export const warpSlice = createSlice({
    name: 'warp',
    initialState,
    reducers: {
        /**
         * Set the current warp
         * @param {WarpState} state - Current state
         * @param {Object} action - Redux action
         * @param {Object} action.payload - warp to set
         */
        setWarp: (state: WarpState, action) => {
            state.warp = action.payload;
            state.error = null;
        },

        /**
         * Update Warpdata partially
         * @param {WarpWarpState} state - Current state
         * @param {Object} action - Redux action
         * @param {Object} action.payload - Partial Warpdata to update
         */
        updateWarp: (state: WarpState, action) => {
            state.warp = { ...state.warp, ...action.payload };
        },

        /**
         * Reset to empty Warpdata
         * @param {WarpWarpState} state - Current state
         */
        resetWarp: (state: WarpState) => {
            state.warp = {};
            state.error = null;
            state.successMessage = 'FileWarp initialized';
        },

        // UI WarpState management
        setActiveTab: (state: WarpState, action) => {
            state.ui.activeTab = action.payload;
        },

        setActiveTool: (state: WarpState, action) => {
            state.activeTool = action.payload;
        },

        setPanelWidth: (state: WarpState, action) => {
            state.ui.panelWidth = action.payload;
        },

        setIsDragging: (state: WarpState, action) => {
            state.ui.isDragging = action.payload;
        },

        setZoomLevel: (state: WarpState, action) => {
            state.ui.zoomLevel = action.payload;
        },

        /**
         * Set loading state
         * @param {WarpWarpState} state - Current state
         * @param {Object} action - Redux action
         * @param {boolean} action.payload - Loading state to set
         */
        setLoading: (state: WarpState, action) => {
            state.loading = action.payload;
        },

        /**
         * Set error message
         * @param {WarpWarpState} state - Current state
         * @param {Object} action - Redux action
         * @param {string|null} action.payload - Error message to set
         */
        setError: (state: WarpState, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        /**
         * Clear error message
         * @param {WarpWarpState} state - Current state
         */
        clearError: (state) => {
            state.error = null;
        },
        /**
         * Set success message
         * @param {WarpWarpState} state - Current state
         * @param {Object} action - Redux action
         * @param {string|null} action.payload - Success message to set
         */
        setSuccess: (state: WarpState, action) => {
            state.successMessage = action.payload;
            state.loading = false;
        },

        /**
         * Clear success message
         * @param {WarpWarpState} state - Current state
         */
        clearSuccess: (state: WarpState) => {
            state.successMessage = null;
        }
    },
});

// Export actions
export const {
    setWarp,
    updateWarp,
    setLoading,
    setError,
    clearError,
    setSuccess,
    clearSuccess,
    resetWarp,
    setActiveTab,
    setActiveTool,
    setPanelWidth,
    setIsDragging,
    setZoomLevel
} = warpSlice.actions;

// Export with the correct Redux Reducer type that allows undefined
const warpReducer: any = warpSlice.reducer as Reducer<WarpState, UnknownAction | undefined>;
export default warpReducer;
