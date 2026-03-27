import { createAsyncThunk } from '@reduxjs/toolkit';
import { authStorage } from './authStorage';
import { api, loginAPI, registAPI, checkAPI } from './authAPI';
import { loadingStarted, loadingStopped } from '../loading/loadingSlice';
import { pushMessage } from '../message/messageSlice';

function authResponse(payload) {
  // payload may be wrapped as { success, message, data: { accessToken, user } }
  const data = payload?.data ?? payload ?? {};
  const token = data?.accessToken || null;
  const user = data?.user || null;

  if (!token) {
    throw new Error(payload?.message || 'API failed');
  }

  return { token, user };
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (formData, { dispatch, rejectWithValue }) => {
    dispatch(loadingStarted());
    try {
      const payload = await loginAPI(formData);
      // console.log('[loginThunk] payload:', payload);
      const { token, user } = authResponse(payload);
      // console.log('[loginThunk] token:', token);

      authStorage.setToken(token);

      dispatch(
        pushMessage({
          type: 'success',
          title: '登入成功',
          timer: 3000,
          backdrop: `rgba(0,0,123,0.4) no-repeat`,
        })
      );
      return { token, user };
    } catch (err) {
      console.error('[loginThunk] error:', err);
      console.error('[loginThunk] err.response:', err?.response?.data);
      return rejectWithValue(err?.message || 'login failed');
    } finally {
      dispatch(loadingStopped());
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (formData, { dispatch, rejectWithValue }) => {
    dispatch(loadingStarted());
    try {
      const payload = await registAPI(formData);
      const data = payload?.data ?? payload ?? {};
      const registerToken = data?.accessToken ?? null;
      const newUserId = Number(data?.user?.id ?? 0);

      if (registerToken && newUserId) {
        const defaultGroupId = Math.random().toString(36).slice(2, 10);
        const newDoc = {
          userId: newUserId,
          stocks: ['2330', '0050'],
          stockOrder: ['2330', '0050'],
          defaultGroupId,
          groups: [
            {
              id: defaultGroupId,
              name: '預設清單',
              stockIds: ['2330', '0050'],
              order: 0,
            },
          ],
        };

        try {
          await api.post('/watchlists', newDoc, {
            headers: { Authorization: `Bearer ${registerToken}` },
          });
        } catch (err) {
          console.warn('[registerThunk] create default watchlist failed:', err?.message);
        }
      }

      dispatch(pushMessage({ type: 'success', title: '註冊成功，請登入' }));
      return { token: null, user: null };
    } catch (err) {
      dispatch(pushMessage({ type: 'error', title: '註冊失敗' }));
      console.log('[registerThunk] error:', err);
      return rejectWithValue(err?.message || 'register failed');
    } finally {
      dispatch(loadingStopped());
    }
  }
);

export const checkThunk = createAsyncThunk(
  'auth/check',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(loadingStarted());
    try {
      const token = authStorage.getToken();
      if (!token) return { token: null, user: null };

      const payload = await checkAPI();

      if (payload?.success === false) throw new Error(payload?.message || 'check failed');

      // /users/:id 可能直接回傳 data = userObject（不是 data.user）
      const user = payload?.data?.user ?? payload?.data ?? payload?.user ?? null;
      return { token, user };
    } catch (err) {
      const status = err?.response?.status;
      const isUnauthorized = status === 401 || status === 403;

      if (isUnauthorized) {
        // 只有 token 明確失效才清
        authStorage.clearToken();
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue('temporary_check_error');
    } finally {
      dispatch(loadingStopped());
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  dispatch(loadingStarted());
  try {
    authStorage.clearToken();
    dispatch(pushMessage({ type: 'info', title: '已登出' }));
    return true;
  } finally {
    dispatch(loadingStopped());
  }
});
