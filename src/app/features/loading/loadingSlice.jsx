import { createSlice } from '@reduxjs/toolkit';

const initialState = { loadingState: {} };

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    loadingStarted: (state, action) => {
      const status = action.payload?.status || 'global';
      state.loadingState[status] = (state.loadingState[status] || 0) + 1;
    },
    loadingStopped: (state, action) => {
      const status = action.payload?.status || 'global';
      const next = (state.loadingState[status] || 0) - 1;
      if (next <= 0) delete state.loadingState[status];
      else state.loadingState[status] = next;
    },
    loadingReset: (state, action) => {
      const status = action.payload?.status;
      if (!status) {
        state.loadingState = {};
      } else {
        delete state.loadingState[status];
      }
    },
  },
});

export const { loadingStarted, loadingStopped, loadingReset } = loadingSlice.actions;
export default loadingSlice.reducer;