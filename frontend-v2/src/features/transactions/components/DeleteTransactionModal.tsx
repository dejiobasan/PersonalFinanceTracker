"use client";

import { FC, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Trash2,
  X,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/shared";
import { TransactionType } from "@/enums";
import { useMounted } from "@/hooks";
import {
  formatAsMoney,
  formatDate,
  handleSafeStringDisplay,
} from "@/utils";
import type { UserTransactionItem } from "../constants";

export interface DeleteTransactionModalProps {
  /** Transaction selected for deletion; modal is open when non-null */
  transaction: UserTransactionItem | null;
  /** Whether the delete mutation is currently in progress */
  isDeleting: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback to confirm deletion */
  onConfirm: (transaction: UserTransactionItem) => void;
}

export const DeleteTransactionModal: FC<DeleteTransactionModalProps> = ({
  transaction,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  const mounted = useMounted();
  const isOpen = Boolean(transaction);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isDeleting, onClose]);

  if (!mounted) return null;

  const isCredit = transaction?.type === TransactionType.CREDIT;

  return createPortal(
    <AnimatePresence>
      {isOpen && transaction && (
        <div
          key="delete-transaction-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-tx-modal-title"
          aria-describedby="delete-tx-modal-description"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (!isDeleting) onClose();
            }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-red-500 to-rose-600" />

            <div className="p-6">
              {/* Header with icon & close button */}
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/70 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  aria-label="Close modal"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="mt-4">
                <h2
                  id="delete-tx-modal-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Delete Transaction
                </h2>
                <p
                  id="delete-tx-modal-description"
                  className="text-sm text-slate-600 mt-1.5 leading-relaxed"
                >
                  Are you sure you want to permanently delete this transaction?
                  This action cannot be undone.
                </p>

                {/* Transaction Summary Box */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 font-medium">
                      Description:
                    </span>
                    <span className="text-slate-900 font-semibold truncate max-w-[220px]">
                      {handleSafeStringDisplay(transaction.description)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 font-medium">Type:</span>
                    {isCredit ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                        Credit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                        <ArrowUpRight className="w-3 h-3 text-rose-600" />
                        Debit
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 font-medium">Amount:</span>
                    <span
                      className={`font-bold tabular-nums ${
                        isCredit ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {isCredit ? "+" : "-"}
                      {formatAsMoney(transaction.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 font-medium">Date:</span>
                    <span className="text-slate-700 font-medium">
                      {formatDate(transaction.dateCreated) || "- -"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="!text-slate-600 hover:!text-slate-900 hover:!bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  isLoading={isDeleting}
                  loadingText="Deleting..."
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  onClick={() => onConfirm(transaction)}
                >
                  Delete Transaction
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default DeleteTransactionModal;

