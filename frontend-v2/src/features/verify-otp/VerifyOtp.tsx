"use client";

import {
  FC,
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
  ChangeEvent,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MailCheck,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

import { APP_PATHS } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  selectUserVerification,
  setUserVerificationOtp,
  clearUserVerification,
  VerificationType,
} from "@/store/slices/authSlice";
import { useVerifyUserMutation, useResendOtpMutation } from "@/services";
import { Button } from "@/components/shared";
import { getErrorMessage } from "@/utils";

const OTP_LENGTH = 6;
const COUNTDOWN_INITIAL_SECONDS = 60;

export const VerifyOtp: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Verification state from store or query params fallback
  const verification = useAppSelector(selectUserVerification);
  const paramEmail = searchParams.get("email");
  const paramType = searchParams.get("type");

  const email = (paramEmail || verification?.userVerificationEmail || "").trim();
  const verificationType: VerificationType =
    (paramType as VerificationType) ||
    (verification?.userVerificationType as VerificationType) ||
    "email_verification";

  const isForgotPasswordFlow = verificationType === "forgot_password";

  // 6-digit OTP state
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown timer for resend
  const [cooldown, setCooldown] = useState<number>(COUNTDOWN_INITIAL_SECONDS);

  // RTK Query Mutations
  const [verifyUser, { isLoading: isVerifying }] = useVerifyUserMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  // Countdown timer effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle single digit entry
  const handleDigitChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    if (!rawVal) {
      const nextOtp = [...otp];
      nextOtp[index] = "";
      setOtp(nextOtp);
      return;
    }

    const digit = rawVal.slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    // Auto-focus next box
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace, Left, Right arrows
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const nextOtp = [...otp];
        nextOtp[index - 1] = "";
        setOtp(nextOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const nextOtp = [...otp];
        nextOtp[index] = "";
        setOtp(nextOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedData) return;

    const nextOtp = [...otp];
    for (let i = 0; i < OTP_LENGTH; i++) {
      nextOtp[i] = pastedData[i] || "";
    }
    setOtp(nextOtp);

    const targetIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[targetIndex]?.focus();
  };

  // Submit OTP Verification
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = otp.join("");

    if (!email) {
      toast.error("No email address found for verification.");
      return;
    }

    if (otpCode.length !== OTP_LENGTH) {
      toast.error(`Please enter all ${OTP_LENGTH} digits of your verification code.`);
      return;
    }

    if (isForgotPasswordFlow) {
      // Save entered OTP in Redux store (in-memory) and navigate to Reset Password
      dispatch(setUserVerificationOtp(otpCode));
      toast.info("Verification code confirmed! Please enter your new password.");
      router.push(
        `${APP_PATHS.RESET_PASSWORD}?email=${encodeURIComponent(email)}`,
      );
      return;
    }

    // Standard Email Verification Flow
    try {
      const response = await verifyUser({
        email,
        otp: otpCode,
        type: "email_verification",
      }).unwrap();

      toast.success(
        response.message || "Email verified successfully! You can now log in.",
      );
      dispatch(clearUserVerification());
      router.push(APP_PATHS.LOGIN);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(
        err,
        "Verification failed. The code may be invalid or expired.",
      );
      toast.error(errorMessage);
      inputRefs.current[0]?.focus();
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;

    if (!email) {
      toast.error("No email address found to resend code.");
      return;
    }

    try {
      const response = await resendOtp({
        email,
        type: isForgotPasswordFlow ? "forgot_password" : "email_verification",
      }).unwrap();

      toast.success(
        response.message || "A fresh verification code has been sent!",
      );
      setCooldown(COUNTDOWN_INITIAL_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(
        err,
        "Failed to resend code. Please try again later.",
      );
      toast.error(errorMessage);
    }
  };

  const isOtpComplete = otp.every((d) => d.length === 1);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Badge & Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3 shadow-2xs">
          {isForgotPasswordFlow ? (
            <>
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Password Recovery</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Security Verification</span>
            </>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isForgotPasswordFlow ? "Enter reset code" : "Verify your email"}
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          We&apos;ve sent a 6-digit confirmation code to{" "}
          {email ? (
            <span className="font-semibold text-slate-900">{email}</span>
          ) : (
            "your email"
          )}
          .
        </p>
      </div>

      {/* 6-Digit OTP Form */}
      <form onSubmit={handleVerify} className="space-y-6" noValidate>
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-3 text-center sm:text-left">
            Enter 6-Digit Verification Code
          </label>
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                disabled={isVerifying}
                aria-label={`Digit ${idx + 1}`}
                className={`w-full h-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border transition-all duration-200 focus:outline-none select-none ${
                  digit
                    ? "border-blue-600 bg-blue-50/20 text-blue-950 ring-2 ring-blue-500/10 shadow-xs"
                    : "border-slate-300 bg-white text-slate-900 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15"
                } ${isVerifying ? "opacity-60 cursor-not-allowed" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isVerifying}
            loadingText="Verifying code..."
            disabled={!isOtpComplete || !email}
            rightIcon={
              isForgotPasswordFlow ? (
                <ArrowRight className="w-5 h-5 ml-1" />
              ) : (
                <MailCheck className="w-5 h-5 ml-1" />
              )
            }
            className="cursor-pointer"
          >
            {isForgotPasswordFlow
              ? "Verify & Reset Password"
              : "Verify & Continue"}
          </Button>
        </div>

        {/* Resend OTP Section */}
        <div className="text-center pt-2">
          {cooldown > 0 ? (
            <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center gap-1.5">
              <span>Didn&apos;t receive the email?</span>
              <span className="font-semibold text-slate-700">
                Resend in {cooldown}s
              </span>
            </p>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs sm:text-sm text-slate-500">
                Didn&apos;t receive the email?
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
              >
                <RotateCcw
                  className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`}
                />
                <span>{isResending ? "Sending..." : "Resend code"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Back to Sign In Link */}
        <div className="pt-4 border-t border-slate-100 flex justify-center">
          <Link
            href={APP_PATHS.LOGIN}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
