import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuth(true);
        // TODO: 可以在這裡呼叫 API 驗證 Token 有效性並取得使用者資料
        // try {
        //   const res = await axios.get(`${BASE_URL}/600/users/me`, {
        //     headers: { Authorization: `Bearer ${token}` }
        //   });
        //   setUser(res.data);
        // } catch (err) {
        //   console.error("Token 失效", err);
        //   logout();
        // }
      }
      setLoading(false);
    };

    initAuth();

    const handleStorageChange = () => {
      const token = localStorage.getItem('authToken');
      setIsAuth(!!token);
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (data) => {
    try {
      const url = `${BASE_URL}/login`;
      const response = await axios.post(url, data);
      const token = response.data.accessToken;

      localStorage.setItem('authToken', token);
      setIsAuth(true);

      if (response.data.user) {
        setUser(response.data.user);
      }
      console.log('登入成功', response);

      return { success: true, data: response.data };
    } catch (error) {
      console.error('登入失敗:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  };

  const register = async (data) => {
    try {
      const url = `${BASE_URL}/register`;
      const response = await axios.post(url, data);
      const token = response.data.accessToken;

      if (token) {
        localStorage.setItem('authToken', token);
        setIsAuth(true);
      }

      if (response.data.user) {
        setUser(response.data.user);
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error('註冊失敗:', error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuth(false);
    setUser(null);
  };

  const value = {
    isAuth,
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
