import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/auth';
import apiInstance from './axios';

/* -------------------- LOGIN -------------------- */
export const login = async (email, password) => {
  try {
    const { data } = await apiInstance.post('user/token/', {
      email,
      password,
    });

    setAuthUser(data.access, data.refresh);
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data || 'Something went wrong',
    };
  }
};

/* -------------------- REGISTER -------------------- */
export const register = async (
  full_name,
  email,
  phone,
  password,
  password_repeat
) => {
  try {
    const { data } = await apiInstance.post('user/register/', {
      full_name,
      email,
      phone,
      password,
      password_repeat,
    });

    await login(email, password);
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response?.data || 'Something went wrong',
    };
  }
};

/* -------------------- LOGOUT -------------------- */
export const logout = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  useAuthStore.getState().logout();
};

/* -------------------- INIT AUTH -------------------- */
export const initAuth = async () => {
  const accessToken = Cookies.get('access_token');
  const refreshToken = Cookies.get('refresh_token');

  if (!accessToken || !refreshToken) return;

  if (isAccessTokenExpired(accessToken)) {
    try {
      const data = await refreshAccessToken();
      setAuthUser(data.access, data.refresh);
    } catch {
      logout();
    }
  } else {
    setAuthUser(accessToken, refreshToken);
  }
};

/* -------------------- SET USER -------------------- */
export const setAuthUser = (accessToken, refreshToken) => {
  Cookies.set('access_token', accessToken, {
    expires: 1,
    secure: true,
    sameSite: 'strict',
  });

  // 🔥 critical: only overwrite refresh if backend sends one
  if (refreshToken) {
    Cookies.set('refresh_token', refreshToken, {
      expires: 7,
      secure: true,
      sameSite: 'strict',
    });
  }

  const decodedUser = jwtDecode(accessToken);
  useAuthStore.getState().setUser(decodedUser);
};

/* -------------------- REFRESH TOKEN -------------------- */
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, data = null) => {
  refreshQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(data);
    }
  });
  refreshQueue = [];
};

export const refreshAccessToken = async () => {
  const refresh = Cookies.get('refresh_token');
  if (!refresh) throw new Error('No refresh token');

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const { data } = await apiInstance.post('user/token/refresh/', { refresh });
    processQueue(null, data);
    return data;
  } catch (error) {
    processQueue(error, null);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

/* -------------------- TOKEN EXPIRY -------------------- */
export const isAccessTokenExpired = token => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
