"use client";

import { FC, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import {
  Receipt,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  FileText,
} from "lucide-react";

import { APP_PATHS } from "@/constants";
import { TransactionType } from "@/enums";
import { Table, Button, StatCard, StatCardProps } from "@/components/shared";
import {
  useGetUserAnalyticsQuery,
  useGetUserTransactionsQuery,
} from "@/services";
import type { IApiService } from "@/types";
import {
  formatAsMoney,
  formatDate,
  formatTime,
  handleSafeStringDisplay,
} from "@/utils";

type UserTransactionItem = IApiService["schemas"]["TransactionDataDto"];

const PREVIEW_LIMIT = 5;

const Dashboard: FC = () => {
  const router = useRouter();

  const { data: analyticsResponse, isLoading: isAnalyticsLoading } =
    useGetUserAnalyticsQuery();

  const {
    data: transactionsResponse,
    isLoading: isTransactionsLoading,
    isFetching: isTransactionsFetching,
  } = useGetUserTransactionsQuery({
    page: 1,
    limit: PREVIEW_LIMIT,
  });

  const transactions = useMemo(
    () => transactionsResponse?.data?.items ?? [],
    [transactionsResponse],
  );

  const totalUserTransactions =
    analyticsResponse?.data?.totalUserTransactions ??
    transactionsResponse?.data?.meta?.total ??
    0;
  const totalUserCreditTransactions =
    analyticsResponse?.data?.totalUserCreditTransactions ?? 0;
  const totalUserDebitTransactions =
    analyticsResponse?.data?.totalUserDebitTransactions ?? 0;
  const averageUserTransactionAmount =
    analyticsResponse?.data?.averageUserTransactionAmount ?? 0;

  const statCards = useMemo<StatCardProps[]>(
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
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* Top User Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Recent Transactions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Recent Transactions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              A quick preview of your most recent financial activity.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => router.push(APP_PATHS.TRANSACTIONS)}
            className="self-start sm:self-auto shrink-0"
          >
            View All
          </Button>
        </div>

        <Table<UserTransactionItem>
          columns={columns}
          data={transactions}
          isLoading={isTransactionsLoading}
          isFetching={isTransactionsFetching}
          skeletonRows={5}
          getRowId={(row) => row.transactionId}
          emptyState={{
            icon: <Receipt className="w-6 h-6" />,
            title: "No transactions yet",
            description:
              "You have not recorded any transactions yet. Head over to the Transactions tab to add your first entry.",
            action: (
              <Button
                type="button"
                variant="primary"
                size="xs"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => router.push(APP_PATHS.TRANSACTIONS)}
              >
                Go to Transactions
              </Button>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
