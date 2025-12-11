// src/app/shared/lib/api/fetch.service.ts
import axios, { type AxiosRequestConfig } from "axios";
import https from "https";
import { createApiClient } from "@/app/shared/lib/api/apiClient";

export class FetchService {
  private static getBaseUrl(): string {
    const isServer = typeof window === "undefined";

    if (isServer) {
      // 👇 what the server will use
      // return process.env.SERVER_API_URL || "http://new-api.openinfo.uz";
      return process.env.SERVER_API_URL || "https://new-api.openinfo.uz";
    }

    // 👇 what the browser will use
    return process.env.NEXT_PUBLIC_EXTERNAL_API_URL || "https://new-api.openinfo.uz";
  }

  // login is always called from client (modal), so we can use createApiClient directly
  public static async login(username: string, password: string) {
    const axiosInstance = createApiClient();
    return axiosInstance.post(
      "/api/v2/userprofile/jwt/create/custom/",
      { username, password },
      { withCredentials: true }
    );
  }

  static async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isServer = typeof window === "undefined";
    const baseURL = this.getBaseUrl();

    const method = (options.method || "GET") as AxiosRequestConfig["method"];
    const data = options.body ? JSON.parse(options.body.toString()) : undefined;
    const headers = (options.headers as Record<string, string> | undefined) || undefined;

    if (isServer) {
      // 🔹 SERVER: standalone axios, using HTTPS
      const axiosInstance = axios.create({
        baseURL,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        // Only needed if there are certificate issues
        httpsAgent: baseURL.startsWith("https://") ? new https.Agent({ rejectUnauthorized: false }) : undefined,
      });

      const { data: resp } = await axiosInstance({
        url: endpoint,
        method,
        data,
      });

      return resp;
    } else {
      // 🔹 CLIENT: shared axios with interceptors & modal logic
      const axiosInstance = createApiClient();

      const { data: resp } = await axiosInstance({
        url: endpoint,
        method,
        data,
        headers,
        withCredentials: true,
      });

      return resp;
    }
  }
}
