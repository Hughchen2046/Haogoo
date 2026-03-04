import { createAsyncThunk } from '@reduxjs/toolkit';
import { authStorage } from './authStorage';
import { loginAPI, registAPI, checkAPI } from './authAPI';
import { loadingStarted, loadingStopped } from '../loading/loadingSlice';
import { pushMessage } from '../message/messageSlice';

function authResponse(payload) {
  // payload = { success, message, data: { accessToken, user } }
  if (!payload?.success) {
    throw new Error(payload?.message || 'API failed');
  }
  const token = payload?.data?.accessToken || null;
  const user = payload?.data?.user || null;
  return { token, user };
}

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (formData, { dispatch, rejectWithValue }) => {
    dispatch(loadingStarted());
    try {
      const payload = await loginAPI(formData);
      const { token, user } = authResponse(payload);

      authStorage.setToken(token);

      dispatch(pushMessage({ type: 'success', text: '登入成功' }));
      return { token, user };
    } catch (err) {
      dispatch(pushMessage({ type: 'error', text: '登入失敗' }));
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

      // 看你註冊 API 是否也回 token+user（如果有＝註冊完自動登入）
      if (payload?.success && payload?.data?.accessToken) {
        const { token, user } = authResponse(payload);
        authStorage.setToken(token);
        dispatch(pushMessage({ type: 'success', text: '註冊成功，已自動登入' }));
        return { token, user };
      }

      dispatch(pushMessage({ type: 'success', text: '註冊成功' }));
      return { token: null, user: null };
    } catch (err) {
      dispatch(pushMessage({ type: 'error', text: '註冊失敗' }));
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

      // 如果你沒有 check endpoint，可以先直接回 {token} 當作已登入
      // 但正式版建議一定要打 check，避免過期 token 假登入
      const payload = await checkAPI();

      // check 回傳格式不一定跟 login 一樣，所以分兩種：
      // A) 也回 {success,data:{user}} → 就取 user
      // B) 只回 ok/user → 你自己微調
      if (payload?.success === false) throw new Error(payload?.message || 'check failed');

      const user = payload?.data?.user ?? payload?.user ?? null;
      return { token, user };
    } catch (err) {
      authStorage.clearToken();
      return rejectWithValue(err?.message || 'check failed');
    } finally {
      dispatch(loadingStopped());
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  dispatch(loadingStarted());
  try {
    authStorage.clearToken();
    dispatch(pushMessage({ type: 'info', text: '已登出' }));
    return true;
  } finally {
    dispatch(loadingStopped());
  }
});
