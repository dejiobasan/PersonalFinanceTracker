import type { IApiService } from "@/types";
import { TransactionType } from "@/enums";

export type UserTransactionItem = IApiService["schemas"]["TransactionDataDto"];

export type TransactionFilterType = "ALL" | TransactionType;

export const DEFAULT_TRANSACTIONS_PAGE_SIZE = 10;
export const TRANSACTIONS_PAGE_SIZE_OPTIONS = [10, 20, 50];

export const TRANSACTION_TYPE_FILTERS: {
  label: string;
  value: TransactionFilterType;
}[] = [
  { label: "All", value: "ALL" },
  { label: "Credit", value: TransactionType.CREDIT },
  { label: "Debit", value: TransactionType.DEBIT },
];

