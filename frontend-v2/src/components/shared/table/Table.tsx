"use client";

import React, { ReactNode, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
} from "lucide-react";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "left" | "center" | "right";
    headerClassName?: string;
    cellClassName?: string;
  }
}

export interface TableEmptyStateProps {
  /** Custom icon to display in the empty state */
  icon?: ReactNode;
  /** Heading text when there is no data */
  title?: string;
  /** Subtitle / description text when there is no data */
  description?: string;
  /** Optional action element (e.g., Clear Filters or Add button) */
  action?: ReactNode;
}

export interface TablePaginationProps {
  /** Current 1-indexed page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items across all pages */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback fired when page changes */
  onPageChange: (page: number) => void;
  /** Optional callback fired when page size (limit) changes */
  onLimitChange?: (limit: number) => void;
  /** Available page size options */
  pageSizeOptions?: number[];
}

export interface TableProps<TData extends RowData> {
  /** Column definitions powered by @tanstack/react-table */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  /** Data array to render */
  data: TData[];
  /** Initial loading state (renders skeleton rows) */
  isLoading?: boolean;
  /** Background fetching state (shows subtle top progress bar) */
  isFetching?: boolean;
  /** Number of skeleton rows to render when loading */
  skeletonRows?: number;
  /** Empty state configuration when data is empty */
  emptyState?: TableEmptyStateProps;
  /** Pagination configuration; omit to hide pagination footer */
  pagination?: TablePaginationProps;
  /** Optional custom row ID getter */
  getRowId?: (originalRow: TData, index: number) => string;
  /** Optional row click handler */
  onRowClick?: (row: TData) => void;
  /** Optional wrapper className */
  className?: string;
}

/**
 * Generates an array of page numbers and ellipsis markers for pagination buttons.
 */
function getPaginationRange(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

const alignClassMap: Record<"left" | "center" | "right", string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function Table<TData extends RowData>({
  columns,
  data,
  isLoading = false,
  isFetching = false,
  skeletonRows = 6,
  emptyState,
  pagination,
  getRowId,
  onRowClick,
  className = "",
}: TableProps<TData>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    manualPagination: Boolean(pagination),
    pageCount: pagination?.totalPages ?? -1,
  });

  const pageNumbers = useMemo(() => {
    if (!pagination) return [];
    const safeTotalPages = Math.max(1, pagination.totalPages);
    return getPaginationRange(pagination.page, safeTotalPages);
  }, [pagination]);

  const startItem =
    pagination && pagination.total > 0
      ? (pagination.page - 1) * pagination.limit + 1
      : 0;
  const endItem =
    pagination && pagination.total > 0
      ? Math.min(pagination.page * pagination.limit, pagination.total)
      : 0;

  return (
    <div
      className={`relative w-full rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden ${className}`}
    >
      {/* Top subtle progress bar during background refetch */}
      {isFetching && !isLoading && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-slate-100 overflow-hidden z-10">
          <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 animate-[pulse_1s_ease-in-out_infinite]" />
        </div>
      )}

      {/* Horizontal Scroll Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          {/* Table Header */}
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-slate-200/80 bg-slate-50/80"
              >
                {headerGroup.headers.map((header) => {
                  const align = header.column.columnDef.meta?.align ?? "left";
                  const headerClassName =
                    header.column.columnDef.meta?.headerClassName ?? "";

                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className={`px-4 sm:px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 select-none whitespace-nowrap ${alignClassMap[align]} ${headerClassName}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200/60 text-sm text-slate-700">
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <tr key={`skeleton-row-${rowIndex}`} className="animate-pulse">
                  {columns.map((_, colIndex) => (
                    <td
                      key={`skeleton-cell-${rowIndex}-${colIndex}`}
                      className="px-4 sm:px-6 py-4 whitespace-nowrap"
                    >
                      <div
                        className={`h-4 rounded-md bg-slate-200/80 ${
                          colIndex === 0
                            ? "w-36"
                            : colIndex === columns.length - 1
                              ? "w-16 ml-auto"
                              : "w-24"
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                  className={`transition-colors duration-150 hover:bg-slate-50/90 ${
                    onRowClick ? "cursor-pointer" : ""
                  } ${isFetching ? "opacity-70" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const align = cell.column.columnDef.meta?.align ?? "left";
                    const cellClassName =
                      cell.column.columnDef.meta?.cellClassName ?? "";

                    return (
                      <td
                        key={cell.id}
                        className={`px-4 sm:px-6 py-4 whitespace-nowrap ${alignClassMap[align]} ${cellClassName}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-14 text-center"
                >
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-400 mb-3.5 shadow-2xs">
                      {emptyState?.icon ?? <Inbox className="w-6 h-6" />}
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                      {emptyState?.title ?? "No records found"}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {emptyState?.description ??
                        "There are no items to display at the moment."}
                    </p>
                    {emptyState?.action && (
                      <div className="mt-4">{emptyState.action}</div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && !isLoading && pagination.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-3.5 bg-slate-50/60 border-t border-slate-200/80 text-xs sm:text-sm text-slate-600">
          {/* Left: Summary & Page Size Selector */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-900">{startItem}</span>{" "}
              to <span className="font-semibold text-slate-900">{endItem}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {pagination.total}
              </span>{" "}
              results
            </span>

            {pagination.onLimitChange && (
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="table-page-size"
                  className="text-slate-500 select-none"
                >
                  Rows:
                </label>
                <select
                  id="table-page-size"
                  value={pagination.limit}
                  onChange={(e) =>
                    pagination.onLimitChange?.(Number(e.target.value))
                  }
                  className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                >
                  {(pagination.pageSizeOptions ?? [10, 20, 50]).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Right: Page Controls */}
          <div className="flex items-center gap-1">
            {/* First Page */}
            <button
              type="button"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page <= 1}
              aria-label="First page"
              className="p-1.5 rounded-lg border border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page */}
            <button
              type="button"
              onClick={() =>
                pagination.onPageChange(Math.max(1, pagination.page - 1))
              }
              disabled={pagination.page <= 1}
              aria-label="Previous page"
              className="p-1.5 rounded-lg border border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 px-1">
              {pageNumbers.map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1 text-xs text-slate-400 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => pagination.onPageChange(item)}
                    aria-current={
                      pagination.page === item ? "page" : undefined
                    }
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      pagination.page === item
                        ? "bg-blue-600 text-white shadow-xs shadow-blue-600/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>

            {/* Next Page */}
            <button
              type="button"
              onClick={() =>
                pagination.onPageChange(
                  Math.min(
                    Math.max(1, pagination.totalPages),
                    pagination.page + 1,
                  ),
                )
              }
              disabled={pagination.page >= pagination.totalPages}
              aria-label="Next page"
              className="p-1.5 rounded-lg border border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              type="button"
              onClick={() =>
                pagination.onPageChange(Math.max(1, pagination.totalPages))
              }
              disabled={pagination.page >= pagination.totalPages}
              aria-label="Last page"
              className="p-1.5 rounded-lg border border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;

