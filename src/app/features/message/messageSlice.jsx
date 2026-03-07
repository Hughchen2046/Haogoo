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
        type = 'info', // 'success' | 'error' | 'warning' | 'info' | 'question'
        title = '',
        text = '',
        timer = 2000,
        icon = '',
        position = 'center', // 'top' | 'top-end' | ...
        width = '',
        color = '',
        backdrop = '',
        showConfirmButton = true,
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
          width,
          color,
          backdrop,
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
