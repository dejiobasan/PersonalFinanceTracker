"use client";

import { FC } from "react";
import { Formik, Form } from "formik";
import { Lock, Check, KeyRound } from "lucide-react";
import { toast } from "react-toastify";

import { Button, Input } from "@/components/shared";
import { useChangePasswordMutation } from "@/services";
import {
  changePasswordValidationSchema,
  ChangePasswordFormValues,
} from "@/validations";
import { getErrorMessage } from "@/utils";

const initialValues: ChangePasswordFormValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const ChangePasswordTab: FC = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (
    values: ChangePasswordFormValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => {
    try {
      const response = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success(response.message || "Password changed successfully!");
      resetForm();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          "Failed to change password. Please verify your current password.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200/80">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Change Password
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Ensure your account uses a strong, unique password to stay secure.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={changePasswordValidationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          resetForm,
        }) => {
          const hasLength = values.newPassword.length >= 8;
          const hasLetter = /[A-Za-z]/.test(values.newPassword);
          const hasNumber = /\d/.test(values.newPassword);

          return (
            <Form className="p-6 space-y-5 max-w-2xl" noValidate>
              <Input
                id="oldPassword"
                name="oldPassword"
                label="Current Password"
                placeholder="Enter your current password"
                isPassword
                required
                autoComplete="current-password"
                leftIcon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                value={values.oldPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.oldPassword && errors.oldPassword
                    ? errors.oldPassword
                    : undefined
                }
              />

              <div>
                <Input
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter a new password"
                  isPassword
                  required
                  autoComplete="new-password"
                  leftIcon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.newPassword && errors.newPassword
                      ? errors.newPassword
                      : undefined
                  }
                />

                {values.newPassword && (
                  <div className="grid grid-cols-3 gap-2 text-xs pt-2">
                    <div
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        hasLength ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>8+ characters</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        hasLetter ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>1+ letter</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        hasNumber ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>1+ number</span>
                    </div>
                  </div>
                )}
              </div>

              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Re-enter your new password"
                isPassword
                required
                autoComplete="new-password"
                leftIcon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : undefined
                }
              />

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={
                    (!values.oldPassword &&
                      !values.newPassword &&
                      !values.confirmPassword) ||
                    isSubmitting ||
                    isLoading
                  }
                  onClick={() => resetForm()}
                  className="!text-slate-600 hover:!text-slate-900 hover:!bg-slate-100"
                >
                  Clear
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting || isLoading}
                  loadingText="Updating..."
                  leftIcon={<KeyRound className="w-4 h-4" />}
                >
                  Update Password
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ChangePasswordTab;

