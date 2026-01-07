import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

const useAuthStore = create(set => ({
  allUserData: null,
  user: null,
  isLoggedIn: false,
  loading: false,

  setUser: user =>
    set({
      allUserData: user || null,
      user: user ? { user_id: user.user_id, username: user.full_name } : null,
      isLoggedIn: !!user,
    }),

  setLoading: loading => set({ loading }),

  logout: () =>
    set({
      allUserData: null,
      user: null,
      isLoggedIn: false,
    }),
}));

if (import.meta.env.DEV) {
  mountStoreDevtool('Auth Store', useAuthStore);
}

export { useAuthStore };
