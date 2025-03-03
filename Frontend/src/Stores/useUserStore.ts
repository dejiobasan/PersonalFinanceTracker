import { create } from "zustand";
import axios from "../Lib/axios";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  Email: string;
  Name: string;
  Role: string;
  Username: string;
  Phonenumber: string;
  Image: string;
}

interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  number: string;
  image: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  User: {
    id: string;
    Name: string;
    Username: string;
    Email: string;
    Role: string;
    Phonenumber: string;
    Image: string;
  };
}

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  User: {
    id: string;
    Name: string;
    Username: string;
    Email: string;
    Role: string;
    Phonenumber: string;
    Image: string;
  };
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  register: async (data: RegisterData) => {
    set({ loading: true });
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      set({ loading: false });
      return;
    }

    try {
      const response = await axios.post<RegisterResponse>(
        "/Users/register",
        data
      );
      if (response.data.success) {
        set({ user: response.data.User, loading: false });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while registering");
    }
  },

  login: async (data: LoginData) => {
    set({ loading: true });
    try {
      const response = await axios.post<LoginResponse>("/Users/login", data, {
        withCredentials: true,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        set({ user: response.data.User, loading: false });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
    set({ loading: false });
  },

  logout: async () => {
    try {
      const response = await axios.post<LogoutResponse>("/Users/logout");
      if (response.data.success) {
        localStorage.removeItem("token");
        set({ user: null });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("Profile/getProfile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
      console.log(error);
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/Users/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

let refreshPromise: Promise<void> | null = null;

// Add an interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
