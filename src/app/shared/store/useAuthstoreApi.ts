import { useAuthStore } from "./useAuthstore";

// Simple non-hook accessor so non-React code (interceptors) can call logout()
export const useAuthStoreApi = {
  getState: () => useAuthStore.getState(),
};
