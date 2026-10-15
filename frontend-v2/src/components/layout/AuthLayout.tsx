"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { BgShape } from "@/app/assets";
import { APP_PATHS } from "@/constants";
import { formatAsMoney } from "@/utils";
import {
  Wallet,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900">
      {/* Left Branding / Graphic Panel ("that bg stuff on the left side") */}
      <aside className="relative w-full lg:w-[45%] xl:w-[42%] bg-blue-600 flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden text-white shrink-0">
        {/* Background Image Texture */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-center opacity-90 pointer-events-none"
          style={{ backgroundImage: `url(${BgShape.src})` }}
          aria-hidden="true"
        />

        {/* Ambient Gradient glow accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo & Mobile Navigation */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href={APP_PATHS.HOME}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-xl cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner group-hover:bg-white/25 group-hover:scale-105 transition-all duration-200">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform duration-200 group-hover:rotate-6" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center">
              Finance
              <span className="text-blue-200 font-extrabold ml-0.5">
                Tracker
              </span>
            </span>
          </Link>

          {/* Mobile Back Link (only visible on mobile screens) */}
          <Link
            href={APP_PATHS.HOME}
            className="lg:hidden inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/90 hover:text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Middle Value Proposition & Glass Card (Desktop only) */}
        <div className="relative z-10 hidden lg:flex flex-col gap-8 my-auto py-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/25 text-blue-100 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Smart Financial Tracking</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Take complete control <br /> of your wealth.
            </h2>
            <p className="text-base text-blue-100/90 leading-relaxed max-w-md">
              Effortlessly track every transaction, automate your monthly
              budgets, and reach your financial goals faster.
            </p>
          </div>

          {/* Frosted Glass Floating Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl shadow-blue-950/30 max-w-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs text-white/70">Monthly Savings Rate</p>
                  <p className="text-sm font-bold text-white">+28.4% this month</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                On Track
              </span>
            </div>
            <div className="pt-3 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-white/60 block">Total Safeguarded</span>
                <span className="font-semibold text-white text-sm">
                  {formatAsMoney(28450000)}
                </span>
              </div>
              <div>
                <span className="text-white/60 block">Transactions Synced</span>
                <span className="font-semibold text-white text-sm">
                  100% Automated
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (Desktop) */}
        <div className="relative z-10 hidden lg:flex items-center justify-between text-xs text-blue-100/70 pt-6 border-t border-white/15">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-200" />
            <span>Bank-grade 256-bit encryption</span>
          </div>
          <span>&copy; {new Date().getFullYear()} FinanceTracker</span>
        </div>
      </aside>

      {/* Right Side: Page Content (`children`) */}
      <main className="relative flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 min-h-[calc(100vh-100px)] lg:min-h-screen overflow-y-auto">
        {/* Desktop Back Link */}
        <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mb-6 hidden lg:flex justify-end">
          <Link
            href={APP_PATHS.HOME}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to website</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto my-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
