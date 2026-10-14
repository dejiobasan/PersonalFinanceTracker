"use client";

import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { APP_PATHS } from "@/constants";
import { formatAsMoney } from "@/utils";

const transactions = [
  {
    name: "Consulting Retainer",
    category: "Income",
    amount: 1850000,
    date: "Today, 2:45 PM",
    isPositive: true,
  },
  {
    name: "Apple Cloud & Services",
    category: "Subscriptions",
    amount: 35000,
    date: "Yesterday",
    isPositive: false,
  },
  {
    name: "Grocery Superstore",
    category: "Groceries",
    amount: 84600,
    date: "Oct 12, 2026",
    isPositive: false,
  },
];

const Home: FC = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 z-10">
      {/* Top Banner / Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-xl shadow-blue-950/20 mb-8"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <Sparkles className="h-4 w-4 text-blue-200" />
        <span>Next-Generation Transaction Management</span>
      </motion.div>

      {/* Main Hero Header & Copy */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12]"
        >
          Manage your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200">
            Transactions
          </span>{" "}
          <br className="hidden sm:inline" />
          <span className="relative inline-block mt-1 sm:mt-0">
            effortlessly
            <svg
              className="absolute -bottom-2 left-0 w-full text-blue-300/60"
              viewBox="0 0 250 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 9C50 3 150 2 247 9"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto font-normal leading-relaxed pt-2"
        >
          The ultimate financial command center to safeguard your money,
          automate recurring expenses, and achieve your financial goals with
          peace of mind.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 sm:pt-6"
        >
          <Link
            href={APP_PATHS.SIGN_UP}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-blue-900 font-bold text-base shadow-2xl shadow-blue-950/40 hover:bg-blue-50 hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Get Started For Free</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href={APP_PATHS.LOGIN}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/25 backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Sign In to Existing Account</span>
          </Link>
        </motion.div>

        {/* Value Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs sm:text-sm text-blue-100/80"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <span>Zero credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-200" />
            <span>Bank-grade 256-bit encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-300" />
            <span>Real-time instant synchronization</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Interactive Live Dashboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="w-full max-w-3xl mt-12 sm:mt-16 relative"
      >
        {/* Glow ambient background behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-300/30 to-indigo-400/30 rounded-3xl blur-2xl pointer-events-none" />

        {/* Dashboard Glass Container */}
        <div className="relative backdrop-blur-2xl bg-slate-900/40 border border-white/25 shadow-2xl shadow-blue-950/50 rounded-3xl p-6 sm:p-8 text-white overflow-hidden">
          {/* Card Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div>
              <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">
                Total Transactions
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {formatAsMoney(14820500)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
                  <TrendingUp className="h-3 w-3" />
                  +18.4%
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 sm:gap-6 text-xs">
              <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/15">
                <span className="text-blue-200/80 block">Credits</span>
                <span className="font-bold text-white sm:text-sm">
                  +{formatAsMoney(3240000)}
                </span>
              </div>
              <div className="bg-white/10 px-3.5 py-2 rounded-xl border border-white/15">
                <span className="text-blue-200/80 block">Debits</span>
                <span className="font-bold text-white sm:text-sm">
                  -{formatAsMoney(910800)}
                </span>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-200/90 px-1 mb-2">
              <span>Recent Transactions</span>
              <span className="text-blue-300/80">Live Feed</span>
            </div>

            {transactions.map((t) => (
              <div
                key={t.name}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors duration-200"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      t.isPositive
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                        : "bg-blue-400/20 text-blue-200 border border-blue-300/30"
                    }`}
                  >
                    {t.isPositive ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-blue-200/70">
                      {t.category} • {t.date}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-sm font-bold ${
                    t.isPositive ? "text-emerald-300" : "text-white"
                  }`}
                >
                  {t.isPositive ? "+" : "-"}
                  {formatAsMoney(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Mini Badges (Desktop) */}
        <div className="hidden lg:flex absolute -left-12 -bottom-6 bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl px-4 py-3 items-center gap-3 text-xs text-white">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold">SafeGuard Active</p>
            <p className="text-white/70 text-[11px]">All transactions verified</p>
          </div>
        </div>

        <div className="hidden lg:flex absolute -right-12 -top-6 bg-slate-900/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl px-4 py-3 items-center gap-3 text-xs text-white">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold">Automated Sync</p>
            <p className="text-white/70 text-[11px]">Instant categorization</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
