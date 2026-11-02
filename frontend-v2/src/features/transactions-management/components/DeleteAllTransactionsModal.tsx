"use client";

import { FC, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/shared";
import { useMounted } from "@/hooks";

export interface DeleteAllTransactionsModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Total number of transactions that will be deleted */
  totalTransactions: number;
  /** Whether the delete mutation is in progress */
  isDeleting: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback to confirm deleting all transactions */
  onConfirm: () => void;
}

export const DeleteAllTransactionsModal: FC<DeleteAllTransactionsModalProps> = ({
  isOpen,
  totalTransactions,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  const mounted = useMounted();

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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          key="delete-all-transactions-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-all-tx-modal-title"
          aria-describedby="delete-all-tx-modal-description"
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
                  id="delete-all-tx-modal-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Delete All Transactions
                </h2>
                <p
                  id="delete-all-tx-modal-description"
                  className="text-sm text-slate-600 mt-1.5 leading-relaxed"
                >
                  Are you sure you want to permanently delete all platform
                  transactions? This action cannot be undone.
                </p>

                <div className="mt-4 p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    Records to be deleted:
                  </span>
                  <span className="text-rose-700 font-bold">
                    {totalTransactions.toLocaleString()} transaction
                    {totalTransactions === 1 ? "" : "s"}
                  </span>
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
                  onClick={onConfirm}
                >
                  Delete All
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

export default DeleteAllTransactionsModal;

