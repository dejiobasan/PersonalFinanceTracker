"use client";

import { FC, useState, useEffect, useMemo, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Receipt,
  Search,
  Trash2,
  RefreshCw,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";

import { Table, Input, Button, StatCard, StatCardProps } from "@/components/shared";
import {
  useGetAllTransactionsQuery,
  useDeleteAllTransactionsMutation,
  useGetAdminAnalyticsQuery,
} from "@/services";
import { TransactionType } from "@/enums";
import {
  formatAsMoney,
  formatDate,
  formatTime,
  getErrorMessage,
  handleSafeStringDisplay,
} from "@/utils";
import {
  TransactionItem,
  TransactionFilterType,
  DEFAULT_TRANSACTIONS_PAGE_SIZE,
  TRANSACTIONS_PAGE_SIZE_OPTIONS,
  TRANSACTION_SEARCH_DEBOUNCE_MS,
  TRANSACTION_TYPE_FILTERS,
  getOwnerInitials,
} from "./constants";
import { DeleteAllTransactionsModal } from "./components";

const TransactionsManagement: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(DEFAULT_TRANSACTIONS_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<TransactionFilterType>("ALL");
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState<boolean>(false);

  // Debounce user name search and reset to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        const trimmed = searchInput.trim();
        if (prev !== trimmed) {
          setPage(1);
        }
        return trimmed;
      });
    }, TRANSACTION_SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Admin Analytics (includes totalTransactions from backend)
  const {
    data: analyticsResponse,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useGetAdminAnalyticsQuery();

  // Fetch paginated transactions
  const {
    data: transactionsResponse,
    isLoading: isTransactionsLoading,
    isFetching: isTransactionsFetching,
    refetch: refetchTransactions,
  } = useGetAllTransactionsQuery({
    page,
    limit,
    ...(typeFilter !== "ALL" ? { type: typeFilter } : {}),
    ...(debouncedSearch ? { name: debouncedSearch } : {}),
  });

  const [deleteAllTransactions, { isLoading: isDeletingAll }] =
    useDeleteAllTransactionsMutation();

  const transactions = useMemo(
    () => transactionsResponse?.data?.items ?? [],
    [transactionsResponse],
  );
  const meta = transactionsResponse?.data?.meta;

  const totalTransactionsCount =
    analyticsResponse?.data?.totalTransactions ?? meta?.total ?? 0;
  const totalCreditTransactions =
    analyticsResponse?.data?.totalCreditTransactions ?? 0;
  const totalDebitTransactions =
    analyticsResponse?.data?.totalDebitTransactions ?? 0;
  const averageTransactionAmount =
    analyticsResponse?.data?.averageTransactionAmount ?? 0;

  const handleRefresh = useCallback(() => {
    refetchAnalytics();
    refetchTransactions();
  }, [refetchAnalytics, refetchTransactions]);

  const handleTypeChange = (nextType: TransactionFilterType) => {
    setTypeFilter(nextType);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setTypeFilter("ALL");
    setPage(1);
  };

  const handleConfirmDeleteAll = async () => {
    try {
      const response = await deleteAllTransactions().unwrap();
      toast.success(
        response.message || "All transactions deleted successfully",
      );
      setIsDeleteAllOpen(false);
      setPage(1);
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to delete transactions. Please try again.",
        ),
      );
    }
  };

  const hasActiveFilters = Boolean(debouncedSearch) || typeFilter !== "ALL";

  const columns = useMemo<ColumnDef<TransactionItem>[]>(
    () => [
      {
        id: "user",
        header: "User",
        cell: ({ row }) => {
          const owner = row.original.user;
          const ownerName = owner?.name || "Unknown User";
          const ownerEmail = owner?.email || "";

          return (
            <div className="flex items-center gap-3 min-w-[180px]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                {getOwnerInitials(owner?.name)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">
                  {handleSafeStringDisplay(ownerName)}
                </p>
                {ownerEmail && (
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {ownerEmail}
                  </p>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: "description",
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-slate-700 min-w-[180px]">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium truncate max-w-[280px]">
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
    ],
    [],
  );

  const analyticsCards = useMemo<StatCardProps[]>(
    () => [
      {
        title: "Total Transactions",
        value: totalTransactionsCount.toLocaleString(),
        subtitle: "Recorded platform transactions",
        icon: <Receipt className="w-6 h-6" />,
        variant: "blue",
        isLoading: isAnalyticsLoading && !transactionsResponse,
      },
      {
        title: "Total Credit",
        value: totalCreditTransactions.toLocaleString(),
        subtitle: "Credit transactions count",
        icon: <TrendingUp className="w-6 h-6" />,
        variant: "emerald",
        valueClassName: "text-emerald-600",
        isLoading: isAnalyticsLoading,
      },
      {
        title: "Total Debit",
        value: totalDebitTransactions.toLocaleString(),
        subtitle: "Debit transactions count",
        icon: <TrendingDown className="w-6 h-6" />,
        variant: "rose",
        valueClassName: "text-rose-600",
        isLoading: isAnalyticsLoading,
      },
      {
        title: "Avg. Transaction",
        value: formatAsMoney(averageTransactionAmount),
        subtitle: "Average transaction amount",
        icon: <Wallet className="w-6 h-6" />,
        variant: "amber",
        valueClassName: "text-slate-900 !text-xl sm:!text-2xl",
        isLoading: isAnalyticsLoading,
      },
    ],
    [
      totalTransactionsCount,
      totalCreditTransactions,
      totalDebitTransactions,
      averageTransactionAmount,
      isAnalyticsLoading,
      transactionsResponse,
    ],
  );

  return (
    <div className="space-y-6">
      {/* Top Admin Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Search, Filter & Actions Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            All Platform Transactions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search transactions by user name or filter by transaction type.
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

          {/* Search by User Name */}
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search by user name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              rightIcon={
                searchInput ? (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    aria-label="Clear search"
                    className="pointer-events-auto text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : undefined
              }
              className="!h-10"
            />
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

          {/* Delete All Button */}
          <Button
            type="button"
            variant="danger"
            size="sm"
            disabled={totalTransactionsCount === 0}
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => setIsDeleteAllOpen(true)}
            className="!h-10 shrink-0"
          >
            Delete All
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Table<TransactionItem>
        columns={columns}
        data={transactions}
        isLoading={isTransactionsLoading}
        isFetching={isTransactionsFetching}
        getRowId={(row) => row.transactionId}
        emptyState={{
          icon: <Receipt className="w-6 h-6" />,
          title: hasActiveFilters
            ? "No matching transactions found"
            : "No transactions recorded",
          description: hasActiveFilters
            ? "Try adjusting your user name search or transaction type filter."
            : "Platform transactions will appear here once users create them.",
          action: hasActiveFilters ? (
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          ) : undefined,
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

      {/* Delete All Transactions Confirmation Modal */}
      <DeleteAllTransactionsModal
        isOpen={isDeleteAllOpen}
        totalTransactions={totalTransactionsCount}
        isDeleting={isDeletingAll}
        onClose={() => {
          if (!isDeletingAll) setIsDeleteAllOpen(false);
        }}
        onConfirm={handleConfirmDeleteAll}
      />
    </div>
  );
};

export default TransactionsManagement;
