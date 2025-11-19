import { create } from "zustand";
import axios from "../Lib/axios";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

interface DashboardStore {
  totalUsers: number;
  totalCreditTransactions: number;
  totalDebitTransactions: number;
  averageTransactions: number;
  totalUserTransactions: number;
  totalUserCreditTransactions: number;
  totalUserDebitTransactions: number;
  averageUserTransactions: number;
  loading: boolean;
  fetchDashboardData: () => Promise<void>;
  fetchUserDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>()(persist(
(set) => ({
  totalUsers: 0,
  totalCreditTransactions: 0,
  totalDebitTransactions: 0,
  averageTransactions: 0,
  totalUserTransactions: 0,
  totalUserCreditTransactions: 0,
  totalUserDebitTransactions: 0,
  averageUserTransactions: 0,
  loading: false,

  fetchDashboardData: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/Dashboard/adminAnalytics");
      const data = response.data;
      set({
        totalUsers: data.totalUsers,
        totalCreditTransactions: data.totalCreditTransactions,
        totalDebitTransactions: data.totalDebitTransactions,
        averageTransactions: data.averageTransactions,
        loading: false
      });
    } catch (error) {
      set({ loading: false });
      console.error("Failed to fetch dashboard data", error);
      toast.error("An error occurred while fetching dashboard details!");
    }
  },

  fetchUserDashboardData: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/Dashboard/userAnalytics");
      const data = response.data;
      set({
        totalUserTransactions: data.totalUserTransactions,
        totalUserCreditTransactions: data.totalUserCreditTransactions,
        totalUserDebitTransactions: data.totalUserDebitTransactions,
        averageUserTransactions: data.averageUserTransactions,
        loading: false
      });
    } catch (error) {
      set({ loading: false });
      console.error("Failed to fetch dashboard data", error);
      toast.error("An error occurred while fetching dashboard details!");
    }
  },}),
  {
    name: "dashboard-store",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      totalUsers: state.totalUsers,
      totalCreditTransactions: state.totalCreditTransactions,
      totalDebitTransactions: state.totalDebitTransactions,
      averageTransactions: state.averageTransactions,
      totalUserTransactions: state.totalUserTransactions,
      totalUserCreditTransactions: state.totalUserCreditTransactions,
      totalUserDebitTransactions: state.totalUserDebitTransactions,
      averageUserTransactions: state.averageUserTransactions,
    }),
  }
));
