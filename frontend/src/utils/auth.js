import { useAuthStore } from '../store/auth';
import axios from './axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export const login = async (email, password) => {
  try {
    const { data, status } = await axios.post('user/token/', {
      email,
      password,
    });
    if (status === 200) {
      setAuthUser(data.access, data.refresh);

      //Alert -  Signed In Successfully
    }
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response || 'Something went wrong ',
    };
  }
};

export const register = async (
  full_name,
  email,
  phone,
  password,
  password_repeat
) => {
  try {
    const { data, status } = await axios.post('user/register', {
      full_name,
      email,
      phone,
      password,
      password_repeat,
    });

    await login(email, password);
    return { data, error: null };
    // Alert - Signed Up Successfully
  } catch (error) {
    return {
      data: null,
      error: error.response.data || 'Something went wrong',
    };
  }
};

export const logout = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  useAuthStore.getState().setUser(null);

  // Alert - Signed Out Successfully
};

export const setUser = async () => {
  const accessToken = Cookies.get('access_token');
  const refreshToken = Cookies.get('access_token');

  if (!accessToken || !refreshToken) {
    return;
  }

  if (isAccessTokenExpire(accessToken)) {
    const respones = await getRefreshToken(refreshToken);
    setAuthUser(respones.access, respones.refresh);
  } else {
    setAuthUser(accessToken, refreshToken);
  }
};

export const setAuthUser = (access_token, refresh_token) => {
  Cookies.set('access_token', access_token, {
    expires: 1,
    secure: true,
  });
  Cookies.set('refresh_token', refresh_token, {
    expires: 7,
    secure: true,
  });
  const user = jwtDecode(access_token) ?? null;

  if (user) {
    useAuthStore.getState().setUser(user);
  }
};

export const getRefreshToken = async () => {
  const refresh_token = Cookies.get('refresh_token');
  const response = await axios.post('user/token/refresh/', {
    refresh_token,
  });

  return response.data;
};

export const isAccessTokenExpire = accessToken => {
  try {
    const codedToken = jwtDecode(accessToken);
    return codedToken.exp < Date.now() / 100;
  } catch (error) {
    console.log(error);
    return true;
  }
};
