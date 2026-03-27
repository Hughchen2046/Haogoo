import axios from 'axios';
import { authStorage } from './authStorage';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '',
    headers: { 'Content-Type': 'application/json' },
});

// 每次送 request，自動把 token 塞進 header
api.interceptors.request.use((config) => {
    const token = authStorage.getToken();
    // 若呼叫端已明確指定 Authorization（例如註冊後立刻建立預設清單），不可覆寫
    const hasAuthorization = Boolean(config.headers?.Authorization || config.headers?.authorization);
    if (!hasAuthorization && token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function getUserIdFromToken(token) {
    if (!token) return null;
    try {
        const payload = token.split('.')[1];
        if (!payload) return null;
        const decoded = JSON.parse(atob(payload));
        return decoded?.sub ?? null;
    } catch {
        return null;
    }
}

export async function loginAPI(payload) {
    // payload: { email, password }
    const res = await api.post('/login', payload);
    return res.data;
}

export async function registAPI(payload) {
    // payload: { email, password, ... }
    const res = await api.post('/register', payload);
    return res.data;
}

export async function checkAPI() {
    const token = authStorage.getToken();
    const userId = getUserIdFromToken(token);
    const target = userId ? `/users/${userId}` : '/users';
    const res = await api.get(target);
    return res.data;
}
