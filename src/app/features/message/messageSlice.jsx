import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = { items: [] };

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    pushMessage: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: ({
        type = 'info',          // 'success' | 'error' | 'warning' | 'info' | 'question'
        title = '',             // SweetAlert title
        text = '',              // SweetAlert text
        timer = 2000,           // ms，0/undefined 表示不自動關
        icon = 'question',
        position = 'center',   // 'top' | 'top-end' | ...
        showConfirmButton = false,
        timerProgressBar = true,
        allowOutsideClick = true,
      } = {}) => ({
        payload: {
          id: nanoid(),
          type,
          title,
          text,
          timer,
          icon,
          position,
          showConfirmButton,
          timerProgressBar,
          allowOutsideClick,
          ts: Date.now(),
        },
      }),
    },

    removeMessage: (state, action) => {
      state.items = state.items.filter((m) => m.id !== action.payload);
    },

    clearMessages: (state) => {
      state.items = [];
    },
  },
});

export const { pushMessage, removeMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;

export const selectMessages = (state) => state.message.items;