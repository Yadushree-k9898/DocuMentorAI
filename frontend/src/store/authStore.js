import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setToken, removeToken, getToken } from '../lib/auth';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      login: (token, user) => {
        setToken(token);
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        removeToken();
        set({ token: null, user: null, isAuthenticated: false });
      },

      setHasHydrated: () => {
        const token = getToken(); // <-- load from localStorage
        if (token) {
          set({ token, isAuthenticated: true });
        }
        set({ hasHydrated: true });
      },
    }),
    {
      name: 'auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated?.();
      },
    }
  )
);
