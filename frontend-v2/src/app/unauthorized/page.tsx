"use client";

import Link from "next/link";
import { ShieldAlert, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/shared";
import { APP_PATHS } from "@/constants";

export default function UnauthorizedPage() {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center text-center py-6 px-4">
      {/* Icon with glowing badge */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/25 blur-2xl rounded-full animate-pulse" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-950 border border-blue-500/30 text-blue-400 shadow-xl shadow-blue-900/30">
          <ShieldAlert className="w-10 h-10" />
        </div>
      </div>

      {/* Status chip */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 tracking-wider uppercase mb-3">
        <span>401 • Unauthorized</span>
      </div>

      {/* Headings */}
      <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mb-3">
        Sign in to continue
      </h1>
      <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-8 max-w-sm">
        This resource is protected and requires an active session. Please log in
        or register a new account to view your transactions.
      </p>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3">
        <Link href={APP_PATHS.LOGIN} className="w-full">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Sign In to Your Account
          </Button>
        </Link>

        <Link href={APP_PATHS.SIGN_UP} className="w-full">
          <Button
            variant="outline"
            fullWidth
            size="lg"
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Create New Account
          </Button>
        </Link>

        <div className="pt-2">
          <Link href={APP_PATHS.HOME}>
            <Button
              variant="underline"
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
