import { createApiClient } from "@/app/shared/lib/api/apiClient";

const apiClient = createApiClient(); // regenerated per call context

export const PortfolioService = {
  login: async (payload: { username: string; password: string }) => {
    const res = await apiClient.post("/api/v2/userprofile/jwt/create/custom/", payload);
    return res.data;
  },

  getPortfolio: async () => {
    const res = await apiClient.get("/api/v2/organizations/portfolio/");
    return res.data;
  },

  getAllStocks: async () => {
    const res = await apiClient.get("/api/v2/organizations/portfolio/all-securities/");
    return res.data;
  },

  addPosition: async (payload: {
    stock_isin: string;
    stock_exchange_status: string;
    number_of_shares: number;
    initial_price: number;
  }) => {
    const res = await apiClient.post("/api/v2/organizations/portfolio/", payload);
    return res.data;
  },

  updatePosition: async (
    id: number,
    payload: {
      number_of_shares: number;
      initial_price: number;
    }
  ) => {
    const res = await apiClient.patch(`/api/v2/organizations/portfolio/${id}/`, payload);
    return res.data;
  },

  deletePosition: async (id: number) => {
    const res = await apiClient.delete(`/api/v2/organizations/portfolio/${id}/`);
    return res.data;
  },
};
