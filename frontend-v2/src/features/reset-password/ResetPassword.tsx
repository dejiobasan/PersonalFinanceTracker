"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form } from "formik";
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import { APP_PATHS } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  selectUserVerificationEmail,
  selectUserVerificationOtp,
  clearUserVerification,
  setLoading,
} from "@/store";
import { useResetPasswordMutation } from "@/services";
import { Button, Input } from "@/components/shared";
import {
  resetPasswordValidationSchema,
  ResetPasswordFormValues,
} from "@/validations";
import { getErrorMessage } from "@/utils";

export const ResetPassword: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const storeEmail = useAppSelector(selectUserVerificationEmail);
  const storeOtp = useAppSelector(selectUserVerificationOtp);

  const resolvedEmail = (storeEmail || "").trim();
  const resolvedOtp = (storeOtp || "").trim();

  const initialValues: ResetPasswordFormValues = {
    email: resolvedEmail,
    otp: resolvedOtp,
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (
    values: ResetPasswordFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      dispatch(
        setLoading({
          isLoading: true,
          text: "Updating your password...",
        }),
      );

      const response = await resetPassword({
        email: values.email.trim(),
        otp: values.otp.trim(),
        newPassword: values.newPassword,
      }).unwrap();

      dispatch(clearUserVerification());

      toast.success(
        response.message ||
          "Password reset successfully! Please sign in with your new password.",
      );

      router.push(APP_PATHS.LOGIN);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(
        err,
        "Failed to reset password. The code may be invalid or expired.",
      );
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header / Intro */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>New Password</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create new password
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Your new password must be at least 8 characters long and contain both
          letters and numbers.
        </p>

        {/* Confirmed Email Status Pill */}
        {resolvedEmail && (
          <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2 truncate">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">
                Resetting password for:{" "}
                <strong className="font-semibold">{resolvedEmail}</strong>
              </span>
            </div>
            {resolvedOtp && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-medium text-[11px] shrink-0">
                <Check className="w-3 h-3 text-emerald-600" />
                Code verified
              </span>
            )}
          </div>
        )}
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={resetPasswordValidationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => {
          const hasLength = values.newPassword.length >= 8;
          const hasLetter = /[A-Za-z]/.test(values.newPassword);
          const hasNumber = /\d/.test(values.newPassword);

          return (
            <Form className="space-y-4" noValidate>
              {/* Email Address (editable only if missing) */}
              {!resolvedEmail && (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  leftIcon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.email && errors.email ? errors.email : undefined
                  }
                />
              )}

              {/* 6-Digit OTP (editable only if missing) */}
              {!resolvedOtp && (
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  label="6-Digit Reset Code"
                  placeholder="123456"
                  required
                  maxLength={6}
                  leftIcon={<KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />}
                  value={values.otp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.otp && errors.otp ? errors.otp : undefined}
                />
              )}

              {/* New Password */}
              <Input
                id="newPassword"
                name="newPassword"
                label="New Password"
                placeholder="••••••••"
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

              {/* Password Requirement Pills */}
              {values.newPassword && (
                <div className="grid grid-cols-3 gap-1.5 text-[11px] pt-0.5">
                  <div
                    className={`flex items-center gap-1 font-medium transition-colors ${
                      hasLength ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>8+ characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 font-medium transition-colors ${
                      hasLetter ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>1+ letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 font-medium transition-colors ${
                      hasNumber ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>1+ number</span>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="••••••••"
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

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting || isLoading}
                  loadingText="Resetting password..."
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                  className="cursor-pointer"
                >
                  Reset Password
                </Button>
              </div>

              {/* Back to sign in */}
              <div className="pt-4 border-t border-slate-100 flex justify-center">
                <Link
                  href={APP_PATHS.LOGIN}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back to sign in</span>
                </Link>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ResetPassword;
