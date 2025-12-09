// src/app/shared/lib/api/apiClient.ts
"use client";

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import https from "https";

import { useAuthStoreApi } from "../../store/useAuthstoreApi";

let api: AxiosInstance | null = null;

// refresh queue
let isRefreshing = false;
let refreshWaiters: Array<() => void> = [];

function getBaseURL() {
  const isServer = typeof window === "undefined";
  if (isServer) return process.env.SERVER_API_URL || "http://new-api.openinfo.uz";
  return process.env.NEXT_PUBLIC_EXTERNAL_API_URL || "https://new-api.openinfo.uz";
}

export function createApiClient(): AxiosInstance {
  if (api) return api;

  const isServer = typeof window === "undefined";

  api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    ...(isServer ? { httpsAgent: new https.Agent({ rejectUnauthorized: false }) } : {}),
  });

  // request interceptor (reserved for locale headers etc.)
  api.interceptors.request.use(config => config);

  // response interceptor
  api.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
      const resp = error.response;
      const orig = error.config as
        | (AxiosRequestConfig & {
            _retry?: boolean;
            _throughReauth?: boolean;
          })
        | undefined;

      // not a 401 or no config → just fail
      if (resp?.status !== 401 || !orig) return Promise.reject(error);

      const url = (orig.url ?? "").toString();
      const isRefreshCall = url.includes("/userprofile/jwt/refresh/custom/");
      const isLogoutCall = url.includes("/userprofile/logout/custom/");
      if (isRefreshCall || isLogoutCall) {
        return Promise.reject(error);
      }

      // ---------- 1) Try refresh once ----------
      if (!orig._retry) {
        orig._retry = true;

        if (isRefreshing) {
          await new Promise<void>(resolve => refreshWaiters.push(resolve));
          return api!(orig);
        }

        isRefreshing = true;
        try {
          await api!.post("/api/v2/userprofile/jwt/refresh/custom/");
          // refresh success – let waiting requests retry
          refreshWaiters.forEach(fn => fn());
          refreshWaiters = [];
          return api!(orig);
        } catch (_err) {
          // refresh failed – flush waiters and continue to reauth
          refreshWaiters.forEach(fn => fn());
          refreshWaiters = [];
        } finally {
          isRefreshing = false;
        }
      }

      // ---------- 2) Refresh failed → mark as logged out and fail ----------
      try {
        const store = useAuthStoreApi.getState();
        store.setUser(null);
      } catch {
        // ignore if store not available
      }

      // Let the original call fail; callers (like useAuthStore.fetchUser) will
      // treat 401 as \"not logged in\" and update their own state.
      return Promise.reject(error);
    }
  );

  return api;
}
