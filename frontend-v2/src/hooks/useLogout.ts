"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hook";
import { clearAuthUser } from "@/store/slices/authSlice";
import { clearSession } from "@/server/auth-session";
import { useLogoutUserMutation } from "@/services/api";
import { APP_PATHS } from "@/constants";
import { toast } from "react-toastify";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const logout = async (showNotification = true) => {
    try {
      await logoutUser()
        .unwrap()
        .catch(() => {
          // Continue with client & cookie teardown even if network/backend fails
        });
      if (showNotification) {
        toast.success("Logged out successfully");
      }
    } finally {
      await clearSession();
      dispatch(clearAuthUser());
      router.push(APP_PATHS.LOGIN);
    }
  };

  return { logout, isLoading };
};

export default useLogout;
