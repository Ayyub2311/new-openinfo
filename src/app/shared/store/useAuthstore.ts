// src/app/shared/store/useAuthstore.ts
"use client";

import { create } from "zustand";
import { createApiClient } from "@/app/shared/lib/api/apiClient";

type User = {
  id: number;
  username: string;
  first_name?: string | null;
  avatar?: string | null;
};

type State = {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;

  setUser: (u: User | null) => void;
  fetchUser: () => Promise<void>;
  ensureLoaded: () => Promise<void>;
  logout: () => Promise<void>;
};

let inflightFetch: Promise<void> | null = null;

export const useAuthStore = create<State>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  setUser: u => set({ user: u }),

  fetchUser: async () => {
    const api = createApiClient();
    if (inflightFetch) return inflightFetch;

    set({ loading: true, error: null });

    inflightFetch = (async () => {
      try {
        const { data } = await api.get<User>("/api/v2/userprofile/users/me/", { withCredentials: true });
        set({ user: data, loading: false, error: null, initialized: true });
      } catch {
        // Not logged in → mark initialized so we don't loop
        set({ user: null, loading: false, initialized: true });
      } finally {
        inflightFetch = null;
      }
    })();

    return inflightFetch;
  },

  ensureLoaded: async () => {
    if (!get().initialized) {
      await get().fetchUser();
    }
  },

  logout: async () => {
    const api = createApiClient();
    try {
      await api.post("/api/v2/userprofile/logout/custom/", null, { withCredentials: true });
    } catch {}
    set({ user: null });
  },
}));

// (Optional non-hook accessor for interceptors)
export const useAuthStoreApi = { getState: () => useAuthStore.getState() };
