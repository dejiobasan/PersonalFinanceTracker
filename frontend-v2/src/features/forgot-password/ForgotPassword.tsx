"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import { Mail, ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { toast } from "react-toastify";

import { APP_PATHS } from "@/constants";
import { useAppDispatch } from "@/store/hook";
import { setLoading, setUserVerification } from "@/store";
import { useForgotPasswordMutation } from "@/services";
import { Button, Input } from "@/components/shared";
import {
  forgotPasswordValidationSchema,
  ForgotPasswordFormValues,
} from "@/validations";
import { getErrorMessage } from "@/utils";

const initialValues: ForgotPasswordFormValues = {
  email: "",
};

export const ForgotPassword: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (
    values: ForgotPasswordFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      dispatch(
        setLoading({
          isLoading: true,
          text: "Sending reset instructions...",
        }),
      );

      const response = await forgotPassword({
        email: values.email.trim(),
      }).unwrap();

      // Store in Redux for the OTP & Reset flows
      dispatch(
        setUserVerification({
          userVerificationEmail: values.email.trim(),
          userVerificationType: "forgot_password",
        }),
      );

      toast.success(
        response.message ||
          "Password reset code sent! Please check your email inbox.",
      );

      router.push(APP_PATHS.VERIFY_OTP);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(
        err,
        "Failed to send reset code. Please check your email and try again.",
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
          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
          <span>Account Recovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          No worries! Enter your registered email address and we&apos;ll send you
          a 6-digit code to reset your password.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={forgotPasswordValidationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form className="space-y-5" noValidate>
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
              error={touched.email && errors.email ? errors.email : undefined}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting || isLoading}
                loadingText="Sending reset code..."
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                className="cursor-pointer"
              >
                Send Reset Code
              </Button>
            </div>

            {/* Back to Login link */}
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
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;
