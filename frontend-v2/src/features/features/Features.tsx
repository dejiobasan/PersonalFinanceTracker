"use client";

import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Receipt,
  TrendingUp,
  TrendingDown,
  Wallet,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Plus,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Layers,
  UserCog,
  Zap,
} from "lucide-react";
import { APP_PATHS } from "@/constants";
import { formatAsMoney } from "@/utils";

const sampleAnalytics = [
  {
    title: "Total Transactions",
    value: "148",
    subtitle: "Your recorded transactions",
    badge: "bg-blue-500/20 text-blue-200 border-blue-400/30",
    icon: Receipt,
  },
  {
    title: "Total Credit",
    value: "64",
    subtitle: "Credit transactions count",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    icon: TrendingUp,
  },
  {
    title: "Total Debit",
    value: "84",
    subtitle: "Debit transactions count",
    badge: "bg-rose-500/20 text-rose-300 border-rose-400/30",
    icon: TrendingDown,
  },
  {
    title: "Avg. Transaction",
    value: formatAsMoney(98450),
    subtitle: "Average transaction amount",
    badge: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    icon: Wallet,
  },
];

const sampleLedgerRows = [
  {
    description: "Product Design Retainer",
    type: "CREDIT" as const,
    amount: 950000,
    date: "14th Oct, 2026",
  },
  {
    description: "AWS Cloud Infrastructure",
    type: "DEBIT" as const,
    amount: 42500,
    date: "13th Oct, 2026",
  },
  {
    description: "Quarterly Dividend Payout",
    type: "CREDIT" as const,
    amount: 210000,
    date: "10th Oct, 2026",
  },
];

const featureCards = [
  {
    title: "Instant Credit & Debit Logging",
    tag: "Fast Entry",
    description:
      "Record new income or expenses in seconds through a clean modal form with real-time field validation and decimal precision.",
    icon: Plus,
    accent:
      "from-blue-400/25 to-indigo-500/20 text-blue-200 border-blue-400/30",
  },
  {
    title: "Automatic Analytics Recalculation",
    tag: "Live Insights",
    description:
      "Your Total Transactions, Total Credit, Total Debit, and Average Transaction cards stay synchronized automatically after every action.",
    icon: TrendingUp,
    accent:
      "from-emerald-400/25 to-teal-500/20 text-emerald-300 border-emerald-400/30",
  },
  {
    title: "Seamless Row Update & Delete",
    tag: "Full Control",
    description:
      "Made a typo or changed an amount? Edit any transaction in place or remove obsolete entries with a protective confirmation dialog.",
    icon: Pencil,
    accent:
      "from-amber-400/25 to-orange-500/20 text-amber-300 border-amber-400/30",
  },
  {
    title: "Smart Type Filtering & Pagination",
    tag: "Organized Ledger",
    description:
      "Switch effortlessly between All, Credit, and Debit views and customize how many rows you view per page with server-backed pagination.",
    icon: SlidersHorizontal,
    accent:
      "from-purple-400/25 to-indigo-500/20 text-purple-200 border-purple-400/30",
  },
  {
    title: "Profile & Security Management",
    tag: "Account Control",
    description:
      "Update your profile photo, display name, phone number, and account password anytime from a dedicated Settings workspace.",
    icon: UserCog,
    accent:
      "from-cyan-400/25 to-blue-500/20 text-cyan-200 border-cyan-400/30",
  },
  {
    title: "Responsive Multi-Device Experience",
    tag: "Anywhere Access",
    description:
      "Built mobile-first with adaptive layouts, smooth drawer navigation, and touch-friendly controls that work beautifully on any screen.",
    icon: Smartphone,
    accent:
      "from-rose-400/25 to-pink-500/20 text-rose-200 border-rose-400/30",
  },
];

const comparisonRows = [
  {
    capability: "Real-time Credit, Debit & Average analytics",
    financeTracker: "Automatic & instant",
    spreadsheets: "Manual formulas prone to errors",
  },
  {
    capability: "Transaction entry validation",
    financeTracker: "Built-in amount & type checks",
    spreadsheets: "Unvalidated free-form cells",
  },
  {
    capability: "Filtering by Credit or Debit",
    financeTracker: "One-click segmented toggle",
    spreadsheets: "Complex filter menus",
  },
  {
    capability: "Mobile & tablet usability",
    financeTracker: "Responsive cards & tables",
    spreadsheets: "Pinch-and-zoom grid scrolling",
  },
  {
    capability: "Data privacy & account protection",
    financeTracker: "256-bit encrypted personal vault",
    spreadsheets: "Shared or unencrypted local files",
  },
];

const Features: FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 space-y-24 sm:space-y-32 z-10">
      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="w-full text-center max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-xl shadow-blue-950/20"
        >
          <Layers className="w-4 h-4 text-blue-200" />
          <span>Platform Capabilities</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12]"
        >
          Everything you need to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200">
            master your cashflow
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="text-base sm:text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed"
        >
          Explore the tools inside FinanceTracker designed to help you log
          transactions faster, analyze spending patterns, and stay in complete
          control of your money.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link
            href={APP_PATHS.SIGN_UP}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-blue-900 font-bold text-base shadow-2xl shadow-blue-950/40 hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>Start Using These Features</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href={APP_PATHS.FAQS}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/25 backdrop-blur-md transition-all duration-200 cursor-pointer"
          >
            <span>Read Common Questions</span>
          </Link>
        </motion.div>
      </section>

      {/* =========================================================
          SPOTLIGHT 1: LIVE ANALYTICS COMMAND CENTER
      ========================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
      >
        {/* Left Copy */}
        <div className="lg:col-span-5 space-y-5 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
            <Zap className="w-3.5 h-3.5" />
            Real-Time Analytics
          </span>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Instant visibility into your financial pulse
          </h2>

          <p className="text-sm sm:text-base text-blue-100/85 leading-relaxed">
            Both your Dashboard and Transactions workspace feature live summary
            cards at the top of the page. The moment you add, edit, or remove a
            transaction, your key metrics refresh automatically.
          </p>

          <ul className="space-y-3 pt-2 text-sm text-blue-100">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Track total recorded transactions at a glance</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Compare Credit vs. Debit transaction counts</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Monitor your average transaction benchmark</span>
            </li>
          </ul>
        </div>

        {/* Right Interactive Preview Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sampleAnalytics.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="backdrop-blur-2xl bg-slate-950/45 border border-white/25 rounded-3xl p-6 text-white shadow-2xl shadow-blue-950/35"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-200/80">
                      {card.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-white mt-2 tabular-nums">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${card.badge}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-blue-200/70 mt-4 pt-3 border-t border-white/10">
                  {card.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* =========================================================
          SPOTLIGHT 2: PRECISION TRANSACTION LEDGER
      ========================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
      >
        {/* Left Interactive Ledger Preview */}
        <div className="lg:col-span-7 order-2 lg:order-1 backdrop-blur-2xl bg-slate-950/50 border border-white/25 rounded-3xl p-6 sm:p-7 text-white shadow-2xl shadow-blue-950/40 space-y-5">
          {/* Mock Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/15">
            <div className="inline-flex items-center p-1 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold">
              <span className="px-3 py-1 rounded-lg bg-white text-blue-900">
                All
              </span>
              <span className="px-3 py-1 text-blue-100/80">Credit</span>
              <span className="px-3 py-1 text-blue-100/80">Debit</span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-500 text-white text-xs font-bold shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              Create Transaction
            </span>
          </div>

          {/* Mock Rows */}
          <div className="space-y-3">
            {sampleLedgerRows.map((row) => {
              const isCredit = row.type === "CREDIT";
              return (
                <div
                  key={row.description}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 ${
                        isCredit
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                          : "bg-rose-500/20 text-rose-300 border-rose-400/30"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-3 h-3" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3" />
                      )}
                      {isCredit ? "Credit" : "Debit"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {row.description}
                      </p>
                      <p className="text-xs text-blue-200/70">{row.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        isCredit ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {isCredit ? "+" : "-"}
                      {formatAsMoney(row.amount)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                        <Pencil className="w-3 h-3" />
                        Update
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Copy */}
        <div className="lg:col-span-5 order-1 lg:order-2 space-y-5 text-white">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 border border-white/25 text-blue-100">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-200" />
            Interactive Ledger
          </span>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Create, filter, update, and delete with zero friction
          </h2>

          <p className="text-sm sm:text-base text-blue-100/85 leading-relaxed">
            Your transaction table is built for speed and precision. Filter by
            transaction type in one click, open the modal to create a new
            record, or modify existing entries directly from any table row.
          </p>

          <ul className="space-y-3 pt-2 text-sm text-blue-100">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Dedicated row actions for instant Update and Delete</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Segmented Credit and Debit filter controls</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Configurable page sizes (10, 20, or 50 rows per page)</span>
            </li>
          </ul>
        </div>
      </motion.section>

      {/* =========================================================
          6-CARD COMPLETE CAPABILITIES GRID
      ========================================================= */}
      <section className="w-full space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 border border-white/25 text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            Complete Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Built to handle every detail of your personal ledger
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-blue-100/85 leading-relaxed">
            Every feature works together seamlessly so you spend less time
            managing records and more time achieving your goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                className="backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/35 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-blue-950/20 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br border flex items-center justify-center ${feature.accent}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-950/35 border border-white/15 text-blue-100">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-blue-100/80 mt-2.5 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Available in all personal accounts</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          COMPARISON MATRIX: FINANCETRACKER VS SPREADSHEETS
      ========================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        className="w-full space-y-10"
      >
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            FinanceTracker vs. Manual Spreadsheets
          </h2>
          <p className="text-sm sm:text-base text-blue-100/85">
            See why switching from static spreadsheets to a dedicated financial
            command center saves hours every month.
          </p>
        </div>

        <div className="backdrop-blur-2xl bg-slate-950/45 border border-white/25 rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-white">
              <thead>
                <tr className="border-b border-white/15 bg-white/5 text-xs uppercase tracking-wider text-blue-200">
                  <th className="py-4 px-6 font-bold">Capability</th>
                  <th className="py-4 px-6 font-bold text-emerald-300">
                    FinanceTracker
                  </th>
                  <th className="py-4 px-6 font-bold text-blue-200/70">
                    Manual Spreadsheets
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                {comparisonRows.map((row) => (
                  <tr
                    key={row.capability}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-white">
                      {row.capability}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-2 font-semibold text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        {row.financeTracker}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-blue-100/70">
                      <span className="inline-flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-300/80 shrink-0" />
                        {row.spreadsheets}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* =========================================================
          BOTTOM CTA BANNER
      ========================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55 }}
        className="w-full"
      >
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-slate-950/65 via-blue-950/60 to-indigo-950/65 border border-white/25 p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl shadow-blue-950/50">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Experience every feature for free today.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-blue-100/85 max-w-2xl mx-auto leading-relaxed">
              Create your account in seconds and start recording your credit and
              debit transactions with live analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={APP_PATHS.SIGN_UP}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-blue-900 font-bold text-base shadow-xl shadow-blue-950/40 hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={APP_PATHS.ABOUT_US}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/25 transition-all duration-200 cursor-pointer"
              >
                <span>Learn About Our Mission</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Features;

