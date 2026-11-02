"use client";

import { FC, useState, useEffect, useMemo, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Users,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  ShieldCheck,
  X,
  Mail,
  Phone,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { Table, Input, Button, StatCard } from "@/components/shared";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useGetAdminAnalyticsQuery,
} from "@/services";
import { useAppSelector } from "@/store/hook";
import { selectAuthUser } from "@/store/slices/authSlice";
import { Role } from "@/enums";
import {
  formatDate,
  getErrorMessage,
  handleSafeStringDisplay,
} from "@/utils";
import {
  UserItem,
  DEFAULT_USERS_PAGE_SIZE,
  USERS_PAGE_SIZE_OPTIONS,
  USER_SEARCH_DEBOUNCE_MS,
  getUserInitials,
} from "./constants";
import { DeleteUserModal } from "./components";

const UserManagement: FC = () => {
  const currentUser = useAppSelector(selectAuthUser);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(DEFAULT_USERS_PAGE_SIZE);
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  // Debounce name search query and reset to page 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        const trimmed = searchInput.trim();
        if (prev !== trimmed) {
          setPage(1);
        }
        return trimmed;
      });
    }, USER_SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Admin Analytics for Total Users card
  const {
    data: analyticsResponse,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useGetAdminAnalyticsQuery();

  // Fetch paginated users
  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isFetching: isUsersFetching,
    refetch: refetchUsers,
  } = useGetAllUsersQuery({
    page,
    limit,
    ...(debouncedSearch ? { name: debouncedSearch } : {}),
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = useMemo(
    () => usersResponse?.data?.items ?? [],
    [usersResponse],
  );
  const meta = usersResponse?.data?.meta;

  const totalUsersCount =
    analyticsResponse?.data?.totalUsers ?? meta?.total ?? 0;

  const handleRefresh = useCallback(() => {
    refetchAnalytics();
    refetchUsers();
  }, [refetchAnalytics, refetchUsers]);

  const handleConfirmDelete = async (targetUser: UserItem) => {
    try {
      const response = await deleteUser(targetUser.userId).unwrap();
      toast.success(response.message || "User deleted successfully");
      setUserToDelete(null);

      // If we deleted the last item on the current page (and page > 1), step back a page
      if (users.length === 1 && page > 1) {
        setPage((prev) => Math.max(1, prev - 1));
      }
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Failed to delete user. Please try again."),
      );
    }
  };

  const columns = useMemo<ColumnDef<UserItem>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => {
          const item = row.original;
          const isSelf = currentUser?.userId === item.userId;
          const isAdminRole =
            item.role === Role.ADMIN || item.role?.toUpperCase() === "ADMIN";

          return (
            <div className="flex items-center gap-3 min-w-[180px]">
              {item.userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.userImage}
                  alt={item.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/15 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                  {getUserInitials(item.name)}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-900 truncate">
                    {handleSafeStringDisplay(item.name)}
                  </span>
                  {isSelf && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
                      You
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {isAdminRole ? (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-700">
                      <ShieldCheck className="w-3 h-3 text-amber-500" />
                      Admin
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium">
                      Member
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[220px]">
              {handleSafeStringDisplay(row.original.email)}
            </span>
          </div>
        ),
      },
      {
        id: "phoneNumber",
        header: "Phone Number",
        accessorKey: "phoneNumber",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{handleSafeStringDisplay(row.original.phoneNumber)}</span>
          </div>
        ),
      },
      {
        id: "isVerified",
        header: "Verified",
        accessorKey: "isVerified",
        cell: ({ row }) => {
          const verified = row.original.isVerified;
          return verified ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Unverified
            </span>
          );
        },
      },
      {
        id: "totalTransactions",
        header: "Total Transactions",
        accessorKey: "totalTransactions",
        meta: { align: "center" },
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200/80">
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            {row.original.totalTransactions.toLocaleString()}
          </span>
        ),
      },
      {
        id: "createdAt",
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formatDate(row.original.createdAt) || "- -"}</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        meta: { align: "right" },
        cell: ({ row }) => {
          const item = row.original;
          const isSelf = currentUser?.userId === item.userId;

          return (
            <div className="flex items-center justify-end">
              <button
                type="button"
                disabled={isSelf}
                onClick={() => setUserToDelete(item)}
                title={
                  isSelf
                    ? "You cannot delete your own admin account"
                    : `Delete ${item.name}`
                }
                aria-label={`Delete ${item.name}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          );
        },
      },
    ],
    [currentUser?.userId],
  );

  return (
    <div className="space-y-6">
      {/* Top Admin Analytics Card — Total Users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={totalUsersCount.toLocaleString()}
          subtitle="Registered platform accounts"
          icon={<Users className="w-6 h-6" />}
          variant="blue"
          isLoading={isAnalyticsLoading && !usersResponse}
        />
      </div>

      {/* Search & Toolbar Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            All Registered Users
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View, search, and manage user accounts and their transaction counts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Search users by name..."
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

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isUsersFetching}
            title="Refresh users list"
            aria-label="Refresh users list"
            className="!h-10 !px-3 shrink-0 !border-slate-300 !text-slate-700 hover:!bg-slate-100"
          >
            <RefreshCw
              className={`w-4 h-4 ${isUsersFetching ? "animate-spin text-blue-600" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Table<UserItem>
        columns={columns}
        data={users}
        isLoading={isUsersLoading}
        isFetching={isUsersFetching}
        getRowId={(row) => row.userId}
        emptyState={{
          icon: <Users className="w-6 h-6" />,
          title: debouncedSearch
            ? `No users matching "${debouncedSearch}"`
            : "No users found",
          description: debouncedSearch
            ? "Try adjusting your search query or clearing the filter."
            : "Registered users will appear here once accounts are created.",
          action: debouncedSearch ? (
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={() => setSearchInput("")}
            >
              Clear Search
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
                pageSizeOptions: USERS_PAGE_SIZE_OPTIONS,
              }
            : undefined
        }
      />

      {/* Delete User Confirmation Modal */}
      <DeleteUserModal
        user={userToDelete}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default UserManagement;
