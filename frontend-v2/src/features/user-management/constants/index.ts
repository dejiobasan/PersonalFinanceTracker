import type { IApiService } from "@/types";

export type UserItem = IApiService["schemas"]["UserListItemDto"];

export const DEFAULT_USERS_PAGE_SIZE = 10;
export const USERS_PAGE_SIZE_OPTIONS = [10, 20, 50];
export const USER_SEARCH_DEBOUNCE_MS = 350;

export const getUserInitials = (name?: string | null): string => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

