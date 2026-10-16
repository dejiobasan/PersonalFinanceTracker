"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hook";
import { clearAuthUser } from "@/store/slices/authSlice";
import { clearSession } from "@/server/auth-session";
import { useLogoutUserMutation } from "@/services/api";
import { APP_PATHS } from "@/constants";
import { getErrorMessage } from "@/utils";
import { toast } from "react-toastify";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const logout = async (showNotification = true) => {
    try {
      await logoutUser().unwrap();
      await clearSession();
      dispatch(clearAuthUser());
      if (showNotification) {
        toast.success("Logged out successfully");
      }
      router.push(APP_PATHS.LOGIN);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(
        err,
        "Failed to log out. Please try again.",
      );
      toast.error(errorMessage);
      throw err;
    }
  };

  return { logout, isLoading };
};

export default useLogout;
