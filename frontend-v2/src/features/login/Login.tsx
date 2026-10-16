"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form } from "formik";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

import { APP_PATHS } from "@/constants";
import { useAppDispatch } from "@/store/hook";
import { setLoading, setAuthUser } from "@/store";
import { useLoginUserMutation } from "@/services";
import { setSecureSession } from "@/server/auth-session";
import { Button, Input } from "@/components/shared";
import { loginValidationSchema, LoginFormValues } from "@/validations";
import { getErrorMessage } from "@/utils";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const Login: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      dispatch(setLoading({ isLoading: true, text: "Signing you in..." }));
      const response = await loginUser(values).unwrap();
      await setSecureSession(
        response.data.role,
        response.data.accessToken,
        response.data.refreshToken
      );
      dispatch(setAuthUser(response.data));
      toast.success(response.message || "Logged in successfully!");
      const redirectUrl = searchParams.get("redirect") || APP_PATHS.DASHBOARD;
      router.push(redirectUrl);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(
        err,
        "Invalid email or password. Please try again."
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
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Welcome Back</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Enter your credentials to access your dashboard.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={loginValidationSchema}
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

            <Input
              id="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              isPassword
              required
              autoComplete="current-password"
              leftIcon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.password && errors.password
                  ? errors.password
                  : undefined
              }
            />

            <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
              <label
                htmlFor="remember"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer select-none"
              >
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500/20 focus:ring-2 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <Link
                href={APP_PATHS.FORGOT_PASSWORD}
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting || isLoading}
                loadingText="Signing in..."
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                Sign In
              </Button>
            </div>

            {/* Bottom Register Prompt */}
            <p className="text-center text-xs sm:text-sm text-slate-500 pt-3">
              Don&apos;t have an account?{" "}
              <Link
                href={APP_PATHS.SIGN_UP}
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
