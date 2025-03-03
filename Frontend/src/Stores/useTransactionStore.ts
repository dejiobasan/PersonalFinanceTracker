import { create } from "zustand";
import axios from "../Lib/axios";
import { toast } from "react-hot-toast";

interface Transaction {
  _id: string;
  User: string;
  Amount: number;
  Description: string;
  Type: string;
  Date: string;
}

interface TransactionData {
  amount: number;
  description: string;
  type: string;
}

interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (data: TransactionData) => Promise<void>;
  fetchAllTransactions: () => Promise<void>;
  fetchATransaction: (id: string) => Promise<void>;
  fetchUserTransactions: () => Promise<void>;
  updateTransaction: (id: string, data: TransactionData) => Promise<void>;
  deleteAllTransactions: () => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setTransactions: (transactions: Transaction[]) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  loading: false,

  setTransactions: (transactions: Transaction[]) => set({ transactions }),

  addTransaction: async (data: TransactionData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/Transactions/addTransaction", data);
      set((prevState) => ({
        transactions: [...prevState.transactions, response.data],
        loading: false,
      }));
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding transaction");
      set({ loading: false });
    }
  },

  fetchUserTransactions: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/Transactions/getUserTransactions");
      set({ transactions: response.data.userTransactions, loading: false});
    } catch (error) {
      set({ loading: false });
      console.error(error);
      toast.error("An error occured while fetching User transactions");
    }

  },

  fetchAllTransactions: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/Transactions/getAllTransactions");
      set({ transactions: response.data.Transactions, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error(error);
      toast.error("An error occured while fetching transactions");
    }
  },

  deleteAllTransactions: async () => {
    set({ loading: true });
    try {
      const response = await axios.delete(
        "/Transactions/deleteAllTransactions"
      );
      toast.success(response.data.message);
      set({ transactions: [], loading: false });
    } catch (error) {
      set({ loading: false });
      console.error(error);
      toast.error("An error occured while deleting transactions");
    }
  },

  fetchATransaction: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/Transactions/getTransaction/${id}`);
      set({ transactions: response.data.Transaction, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error(error);
      toast.error("An error occured while fetching transaction");
    }
  },

  updateTransaction: async (id, data: TransactionData) => {
    set({ loading: true });
    try {
      const response = await axios.put(
        `/Transactions/updateTransaction/${id}`,
        data
      );
      set((prevState) => ({
        transactions: [...prevState.transactions, response.data],
        loading: false,
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating transaction");
      set({ loading: false });
    }
  },

  deleteTransaction: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.delete(
        `/Transactions/deleteTransaction/${id}`
      );
      set((prevState) => ({
        transactions: prevState.transactions.filter(
          (transaction) => transaction._id !== id
        ),
        loading: false,
      }));
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting transaction");
      set({ loading: false });
    }
  },
}));
