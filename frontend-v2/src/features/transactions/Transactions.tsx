"use client";

import { FC, useState, useMemo, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Receipt,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  Table,
  Button,
  StatCard,
  StatCardProps,
} from "@/components/shared";
import {
  useGetUserAnalyticsQuery,
  useGetUserTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from "@/services";
import { TransactionType } from "@/enums";
import { TransactionFormValues } from "@/validations";
import {
  formatAsMoney,
  formatDate,
  formatTime,
  getErrorMessage,
  handleSafeStringDisplay,
} from "@/utils";
import {
  UserTransactionItem,
  TransactionFilterType,
  DEFAULT_TRANSACTIONS_PAGE_SIZE,
  TRANSACTIONS_PAGE_SIZE_OPTIONS,
  TRANSACTION_TYPE_FILTERS,
} from "./constants";
import {
  TransactionFormModal,
  DeleteTransactionModal,
} from "./components";

const Transactions: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(DEFAULT_TRANSACTIONS_PAGE_SIZE);
  const [typeFilter, setTypeFilter] = useState<TransactionFilterType>("ALL");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<UserTransactionItem | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<UserTransactionItem | null>(null);

  // Fetch User Analytics
  const {
    data: analyticsResponse,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useGetUserAnalyticsQuery();

  // Fetch Paginated User Transactions
  const {
    data: transactionsResponse,
    isLoading: isTransactionsLoading,
    isFetching: isTransactionsFetching,
    refetch: refetchTransactions,
  } = useGetUserTransactionsQuery({
    page,
    limit,
    ...(typeFilter !== "ALL" ? { type: typeFilter } : {}),
  });

  const [createTransaction, { isLoading: isCreating }] =
    useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] =
    useUpdateTransactionMutation();
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();

  const transactions = useMemo(
    () => transactionsResponse?.data?.items ?? [],
    [transactionsResponse],
  );
  const meta = transactionsResponse?.data?.meta;

  const totalUserTransactions =
    analyticsResponse?.data?.totalUserTransactions ?? meta?.total ?? 0;
  const totalUserCreditTransactions =
    analyticsResponse?.data?.totalUserCreditTransactions ?? 0;
  const totalUserDebitTransactions =
    analyticsResponse?.data?.totalUserDebitTransactions ?? 0;
  const averageUserTransactionAmount =
    analyticsResponse?.data?.averageUserTransactionAmount ?? 0;

  const handleRefresh = useCallback(() => {
    refetchAnalytics();
    refetchTransactions();
  }, [refetchAnalytics, refetchTransactions]);

  const handleTypeChange = (nextType: TransactionFilterType) => {
    setTypeFilter(nextType);
    setPage(1);
  };

  const handleFormSubmit = async (values: TransactionFormValues) => {
    if (transactionToEdit) {
      const payload: {
        description?: string;
        amount?: number;
        type?: "CREDIT" | "DEBIT";
      } = {};

      if (values.description.trim() !== transactionToEdit.description) {
        payload.description = values.description.trim();
      }
      if (Number(values.amount) !== Number(transactionToEdit.amount)) {
        payload.amount = Number(values.amount);
      }
      if (values.type !== transactionToEdit.type) {
        payload.type = values.type;
      }

      if (Object.keys(payload).length === 0) {
        toast.info("No changes detected.");
        return;
      }

      try {
        const response = await updateTransaction({
          id: transactionToEdit.transactionId,
          body: payload,
        }).unwrap();
        toast.success(
          response.message || "Transaction updated successfully",
        );
        setTransactionToEdit(null);
      } catch (error: unknown) {
        toast.error(
          getErrorMessage(
            error,
            "Failed to update transaction. Please try again.",
          ),
        );
      }
    } else {
      try {
        const response = await createTransaction({
          description: values.description.trim(),
          amount: Number(values.amount),
          type: values.type,
        }).unwrap();
        toast.success(
          response.message || "Transaction created successfully",
        );
        setIsCreateModalOpen(false);
        setPage(1);
      } catch (error: unknown) {
        toast.error(
          getErrorMessage(
            error,
            "Failed to create transaction. Please try again.",
          ),
        );
      }
    }
  };

  const handleConfirmDelete = async (target: UserTransactionItem) => {
    try {
      const response = await deleteTransaction(target.transactionId).unwrap();
      toast.success(
        response.message || "Transaction deleted successfully",
      );
      setTransactionToDelete(null);

      // Step back a page if the last item on the current page (and page > 1) was deleted
      if (transactions.length === 1 && page > 1) {
        setPage((prev) => Math.max(1, prev - 1));
      }
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to delete transaction. Please try again.",
        ),
      );
    }
  };

  const hasActiveFilter = typeFilter !== "ALL";

  const analyticsCards = useMemo<StatCardProps[]>(
    () => [
      {
        title: "Total Transactions",
        value: totalUserTransactions.toLocaleString(),
        subtitle: "Your recorded transactions",
        icon: <Receipt className="w-6 h-6" />,
        variant: "blue",
        isLoading: isAnalyticsLoading && !transactionsResponse,
      },
      {
        title: "Total Credit",
        value: totalUserCreditTransactions.toLocaleString(),
        subtitle: "Credit transactions count",
        icon: <TrendingUp className="w-6 h-6" />,
        variant: "emerald",
        valueClassName: "text-emerald-600",
        isLoading: isAnalyticsLoading,
      },
      {
        title: "Total Debit",
        value: totalUserDebitTransactions.toLocaleString(),
        subtitle: "Debit transactions count",
        icon: <TrendingDown className="w-6 h-6" />,
        variant: "rose",
        valueClassName: "text-rose-600",
        isLoading: isAnalyticsLoading,
      },
      {
        title: "Avg. Transaction",
        value: formatAsMoney(averageUserTransactionAmount),
        subtitle: "Average transaction amount",
        icon: <Wallet className="w-6 h-6" />,
        variant: "amber",
        valueClassName: "text-slate-900 !text-xl sm:!text-2xl",
        isLoading: isAnalyticsLoading,
      },
    ],
    [
      totalUserTransactions,
      totalUserCreditTransactions,
      totalUserDebitTransactions,
      averageUserTransactionAmount,
      isAnalyticsLoading,
      transactionsResponse,
    ],
  );

  const columns = useMemo<ColumnDef<UserTransactionItem>[]>(
    () => [
      {
        id: "description",
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-slate-700 min-w-[180px]">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium truncate max-w-[300px]">
              {handleSafeStringDisplay(row.original.description)}
            </span>
          </div>
        ),
      },
      {
        id: "type",
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => {
          const isCredit = row.original.type === TransactionType.CREDIT;
          return isCredit ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
              Credit
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
              Debit
            </span>
          );
        },
      },
      {
        id: "amount",
        header: "Amount",
        accessorKey: "amount",
        meta: { align: "right" },
        cell: ({ row }) => {
          const isCredit = row.original.type === TransactionType.CREDIT;
          return (
            <span
              className={`font-bold tabular-nums ${
                isCredit ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {isCredit ? "+" : "-"}
              {formatAsMoney(row.original.amount)}
            </span>
          );
        },
      },
      {
        id: "dateCreated",
        header: "Date Created",
        accessorKey: "dateCreated",
        cell: ({ row }) => {
          const dateStr = formatDate(row.original.dateCreated);
          const timeStr = formatTime(row.original.dateCreated);
          return (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div>
                <span className="font-medium text-slate-700">
                  {dateStr || "- -"}
                </span>
                {timeStr && (
                  <span className="text-xs text-slate-400 ml-1.5">
                    {timeStr}
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        meta: { align: "right" },
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTransactionToEdit(item)}
                title={`Update "${item.description}"`}
                aria-label={`Update ${item.description}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 transition-all duration-150 cursor-pointer shadow-2xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Update</span>
              </button>

              <button
                type="button"
                onClick={() => setTransactionToDelete(item)}
                title={`Delete "${item.description}"`}
                aria-label={`Delete ${item.description}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all duration-150 cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

  const isFormModalOpen = isCreateModalOpen || Boolean(transactionToEdit);
  const isFormSubmitting = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      {/* Top User Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Filter & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            My Transactions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View, filter, and manage your personal credit and debit
            transactions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Type Filter Segmented Controls */}
          <div
            className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70"
            role="group"
            aria-label="Filter transactions by type"
          >
            {TRANSACTION_TYPE_FILTERS.map((option) => {
              const active = typeFilter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTypeChange(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-white text-blue-600 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Refresh Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isTransactionsFetching}
            title="Refresh transactions"
            aria-label="Refresh transactions"
            className="!h-10 !px-3 shrink-0 !border-slate-300 !text-slate-700 hover:!bg-slate-100"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isTransactionsFetching ? "animate-spin text-blue-600" : ""
              }`}
            />
          </Button>

          {/* Create Transaction Button */}
          <Button
            type="button"
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
            className="!h-10 shrink-0"
          >
            Create Transaction
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Table<UserTransactionItem>
        columns={columns}
        data={transactions}
        isLoading={isTransactionsLoading}
        isFetching={isTransactionsFetching}
        getRowId={(row) => row.transactionId}
        emptyState={{
          icon: <Receipt className="w-6 h-6" />,
          title: hasActiveFilter
            ? `No ${typeFilter.toLowerCase()} transactions found`
            : "No transactions recorded yet",
          description: hasActiveFilter
            ? "Try switching the transaction type filter to view other records."
            : "Get started by recording your first credit or debit transaction.",
          action: hasActiveFilter ? (
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={() => handleTypeChange("ALL")}
            >
              Show All Transactions
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="xs"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Transaction
            </Button>
          ),
        }}
        pagination={
          meta
            ? {
                page: meta.page,
                limit: meta.limit,
                total: meta.total,
                totalPages: meta.totalPages,
                onPageChange: (newPage) => setPage(newPage),
                onLimitChange: (newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                },
                pageSizeOptions: TRANSACTIONS_PAGE_SIZE_OPTIONS,
              }
            : undefined
        }
      />

      {/* Create / Update Transaction Modal */}
      <TransactionFormModal
        isOpen={isFormModalOpen}
        transaction={transactionToEdit}
        isSubmitting={isFormSubmitting}
        onClose={() => {
          if (!isFormSubmitting) {
            setIsCreateModalOpen(false);
            setTransactionToEdit(null);
          }
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Transaction Confirmation Modal */}
      <DeleteTransactionModal
        transaction={transactionToDelete}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setTransactionToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Transactions;
