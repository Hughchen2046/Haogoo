import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, registerThunk, checkThunk, logoutThunk } from './authThunks';

const initialState = {
  status: 'idle', // idle / checking / auth / guest
  user: null,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 一開始check
      .addCase(checkThunk.pending, (state) => {
        state.status = 'checking';
        state.error = null;
      })
      .addCase(checkThunk.fulfilled, (state, action) => {
        const { token, user } = action.payload || {};
        if (token) {
          state.status = 'authed';
          state.token = token;
          state.user = user || null;
        } else {
          state.status = 'guest';
          state.token = null;
          state.user = null;
        }
      })
      .addCase(checkThunk.rejected, (state, action) => {
        state.status = 'guest';
        state.token = null;
        state.user = null;
        state.error = action.payload || '驗證失敗';
      })

      // 登入
      .addCase(loginThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'authed';
        state.token = action.payload.token;
        state.user = action.payload.user || null;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'guest';
        state.token = null;
        state.user = null;
        state.error = action.payload || '登入失敗';
      })

      // 註冊
      .addCase(registerThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        if (action.payload?.token) {
          state.status = 'authed';
          state.token = action.payload.token;
          state.user = action.payload.user || null;
        } else {
          state.status = 'guest';
        }
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.error = action.payload || '註冊失敗';
      })

      // 登出
      .addCase(logoutThunk.fulfilled, (state) => {
        state.status = 'guest';
        state.token = null;
        state.user = null;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export const AuthCheck = (state) => state.auth;
export const AuthStatus = (state) => state.auth.status;
export const authUser = (state) => state.auth.user;
export const authToken = (state) => state.auth.token;

export const IsAuthed = (state) => !!state.auth.token;
export const IsChecking = (state) => state.auth.status === 'checking';

export default authSlice.reducer;
