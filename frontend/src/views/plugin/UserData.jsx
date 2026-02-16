import { useMemo } from 'react';
import Cookie from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function useUserData() {
  return useMemo(() => {
    const access = Cookie.get('access_token');
    const refresh = Cookie.get('refresh_token');

    if (!access || !refresh) return null;

    return jwtDecode(refresh);
  }, []);
}

export default useUserData;
