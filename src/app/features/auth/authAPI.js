import axios from 'axios';
import { authStorage } from './authStorage';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '',
    headers: { 'Content-Type': 'application/json' },
});

// 每次送 request，自動把 token 塞進 header
api.interceptors.request.use((config) => {
    const token = authStorage.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

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
    const res = await api.get('/users');
    return res.data;
}
