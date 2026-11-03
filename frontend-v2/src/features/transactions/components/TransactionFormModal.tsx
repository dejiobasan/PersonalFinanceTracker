"use client";

import { FC, useEffect } from "react";
import { createPortal } from "react-dom";
import { Formik, Form } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Plus,
  Save,
  FileText,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Pencil,
} from "lucide-react";

import { Button, Input } from "@/components/shared";
import { TransactionType } from "@/enums";
import { useMounted } from "@/hooks";
import {
  transactionValidationSchema,
  TransactionFormValues,
} from "@/validations";
import type { UserTransactionItem } from "../constants";

export interface TransactionFormModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Transaction being edited; null when creating a new transaction */
  transaction: UserTransactionItem | null;
  /** Whether the create or update mutation is currently running */
  isSubmitting: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback invoked when the form is valid and submitted */
  onSubmit: (values: TransactionFormValues) => Promise<void> | void;
}

export const TransactionFormModal: FC<TransactionFormModalProps> = ({
  isOpen,
  transaction,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const mounted = useMounted();
  const isEditMode = Boolean(transaction);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isSubmitting) {
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
  }, [isOpen, isSubmitting, onClose]);

  if (!mounted) return null;

  const initialValues: TransactionFormValues = {
    description: transaction?.description ?? "",
    amount:
      transaction?.amount !== undefined
        ? Number(transaction.amount)
        : ("" as unknown as number),
    type: transaction?.type ?? TransactionType.DEBIT,
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          key="transaction-form-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tx-form-modal-title"
          aria-describedby="tx-form-modal-description"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (!isSubmitting) onClose();
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
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600" />

            <div className="p-6">
              {/* Header with icon & close button */}
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
                  {isEditMode ? (
                    <Pencil className="w-5 h-5" />
                  ) : (
                    <Receipt className="w-6 h-6" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  aria-label="Close modal"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <h2
                  id="tx-form-modal-title"
                  className="text-lg font-bold text-slate-900"
                >
                  {isEditMode ? "Update Transaction" : "Create Transaction"}
                </h2>
                <p
                  id="tx-form-modal-description"
                  className="text-sm text-slate-500 mt-1"
                >
                  {isEditMode
                    ? "Modify the transaction details below and save your changes."
                    : "Enter the details below to record a new credit or debit transaction."}
                </p>
              </div>

              {/* Formik Form */}
              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={transactionValidationSchema}
                onSubmit={async (values) => {
                  await onSubmit({
                    description: values.description.trim(),
                    amount: Number(values.amount),
                    type: values.type,
                  });
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  setFieldValue,
                }) => {
                  const hasChanges = isEditMode
                    ? values.description.trim() !==
                        (transaction?.description ?? "") ||
                      Number(values.amount) !== Number(transaction?.amount) ||
                      values.type !== transaction?.type
                    : true;

                  return (
                    <Form className="mt-5 space-y-4" noValidate>
                      {/* Transaction Type Selector */}
                      <div className="space-y-1.5">
                        <span className="block text-xs sm:text-sm font-semibold text-slate-700 select-none">
                          Transaction Type
                          <span className="text-rose-500 ml-1">*</span>
                        </span>

                        <div
                          className="grid grid-cols-2 gap-3"
                          role="radiogroup"
                          aria-label="Transaction Type"
                        >
                          {/* Credit Option */}
                          <button
                            type="button"
                            role="radio"
                            aria-checked={values.type === TransactionType.CREDIT}
                            disabled={isSubmitting}
                            onClick={() =>
                              setFieldValue("type", TransactionType.CREDIT)
                            }
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                              values.type === TransactionType.CREDIT
                                ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20 shadow-2xs"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                          >
                            <ArrowDownLeft
                              className={`w-4 h-4 ${
                                values.type === TransactionType.CREDIT
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }`}
                            />
                            <span>Credit (Income)</span>
                          </button>

                          {/* Debit Option */}
                          <button
                            type="button"
                            role="radio"
                            aria-checked={values.type === TransactionType.DEBIT}
                            disabled={isSubmitting}
                            onClick={() =>
                              setFieldValue("type", TransactionType.DEBIT)
                            }
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                              values.type === TransactionType.DEBIT
                                ? "bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20 shadow-2xs"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                          >
                            <ArrowUpRight
                              className={`w-4 h-4 ${
                                values.type === TransactionType.DEBIT
                                  ? "text-rose-600"
                                  : "text-slate-400"
                              }`}
                            />
                            <span>Debit (Expense)</span>
                          </button>
                        </div>
                      </div>

                      {/* Description Input */}
                      <Input
                        id="tx-description"
                        name="description"
                        type="text"
                        label="Description"
                        placeholder="e.g. Monthly Salary, Grocery shopping"
                        required
                        disabled={isSubmitting}
                        leftIcon={<FileText className="w-4 h-4" />}
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.description && errors.description
                            ? errors.description
                            : undefined
                        }
                      />

                      {/* Amount Input */}
                      <Input
                        id="tx-amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        inputMode="decimal"
                        label="Amount (₦)"
                        placeholder="0.00"
                        required
                        disabled={isSubmitting}
                        leftIcon={<Wallet className="w-4 h-4" />}
                        value={
                          values.amount === undefined || values.amount === null
                            ? ""
                            : String(values.amount)
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.amount && errors.amount
                            ? errors.amount
                            : undefined
                        }
                      />

                      {/* Footer Actions */}
                      <div className="pt-3 flex items-center justify-end gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={onClose}
                          disabled={isSubmitting}
                          className="!text-slate-600 hover:!text-slate-900 hover:!bg-slate-100"
                        >
                          Cancel
                        </Button>

                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          disabled={!hasChanges}
                          isLoading={isSubmitting}
                          loadingText={
                            isEditMode ? "Updating..." : "Creating..."
                          }
                          leftIcon={
                            isEditMode ? (
                              <Save className="w-4 h-4" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )
                          }
                        >
                          {isEditMode
                            ? "Save Changes"
                            : "Create Transaction"}
                        </Button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default TransactionFormModal;

