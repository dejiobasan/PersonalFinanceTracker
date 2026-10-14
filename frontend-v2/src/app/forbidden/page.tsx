"use client";

import Link from "next/link";
import { ShieldX, LayoutDashboard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/shared";
import { APP_PATHS } from "@/constants";

export default function ForbiddenPage() {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center text-center py-6 px-4">
      {/* Icon with glowing badge */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-rose-500/25 blur-2xl rounded-full animate-pulse" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-900 to-rose-950 border border-rose-500/40 text-rose-400 shadow-xl shadow-rose-950/40">
          <ShieldX className="w-10 h-10" />
        </div>
      </div>

      {/* Status chip */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-xs font-semibold text-rose-400 tracking-wider uppercase mb-3">
        <span>403 • Access Restricted</span>
      </div>

      {/* Headings */}
      <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight mb-3">
        Admin privileges required
      </h1>
      <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-8 max-w-sm">
        This section is reserved for administrators only. Your account does not
        have the required permissions to access this management console.
      </p>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3">
        <Link href={APP_PATHS.DASHBOARD} className="w-full">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            leftIcon={<LayoutDashboard className="w-4 h-4" />}
          >
            Go to Your Dashboard
          </Button>
        </Link>

        <Link href={APP_PATHS.HOME} className="w-full">
          <Button
            variant="outline"
            fullWidth
            size="lg"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
