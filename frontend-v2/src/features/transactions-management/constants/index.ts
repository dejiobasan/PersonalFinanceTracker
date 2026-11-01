import type { IApiService } from "@/types";
import { TransactionType } from "@/enums";

export type TransactionItem = IApiService["schemas"]["TransactionDataDto"];

export type TransactionFilterType = "ALL" | TransactionType;

export const DEFAULT_TRANSACTIONS_PAGE_SIZE = 10;
export const TRANSACTIONS_PAGE_SIZE_OPTIONS = [10, 20, 50];
export const TRANSACTION_SEARCH_DEBOUNCE_MS = 350;

export const TRANSACTION_TYPE_FILTERS: {
  label: string;
  value: TransactionFilterType;
}[] = [
  { label: "All", value: "ALL" },
  { label: "Credit", value: TransactionType.CREDIT },
  { label: "Debit", value: TransactionType.DEBIT },
];

export const getOwnerInitials = (name?: string | null): string => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

