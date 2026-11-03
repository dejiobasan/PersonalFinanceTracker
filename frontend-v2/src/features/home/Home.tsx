"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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
  UserPlus,
  Receipt,
  BarChart3,
  SlidersHorizontal,
  Smartphone,
  HelpCircle,
  ChevronDown,
  Layers,
  Clock,
  Award,
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

const platformMetrics = [
  {
    value: "256-Bit",
    label: "Bank-Grade Encryption",
    detail: "End-to-end protected sessions",
    icon: ShieldCheck,
  },
  {
    value: "< 50ms",
    label: "Real-Time Ledger Sync",
    detail: "Instant analytics recalculation",
    icon: Zap,
  },
  {
    value: "100%",
    label: "Full Ownership & Control",
    detail: "Create, edit, or delete anytime",
    icon: Award,
  },
  {
    value: "24/7",
    label: "Always-On Cloud Access",
    detail: "Desktop, tablet & mobile ready",
    icon: Clock,
  },
];

const howItWorksSteps = [
  {
    step: "01",
    badge: "Quick Onboarding",
    title: "Create Your Personal Account",
    description:
      "Sign up in under a minute and set up your personal profile. Your private financial workspace is immediately ready for you to start tracking.",
    highlights: ["Fast & simple registration", "Zero credit card required"],
    icon: UserPlus,
  },
  {
    step: "02",
    badge: "Effortless Logging",
    title: "Record Credits & Debits Instantly",
    description:
      "Log incoming revenue or daily expenses with structured descriptions, exact amounts, and credit/debit classification. Update or remove entries anytime as your records evolve.",
    highlights: [
      "One-click Credit & Debit toggle",
      "Instant edit & delete actions",
    ],
    icon: Receipt,
  },
  {
    step: "03",
    badge: "Actionable Clarity",
    title: "Monitor Live Cashflow Analytics",
    description:
      "Watch your dashboard metrics update automatically. Track total transactions, credit vs. debit volume, and average transaction benchmarks without manual spreadsheets.",
    highlights: [
      "Automated average & volume metrics",
      "Smart type filtering & pagination",
    ],
    icon: BarChart3,
  },
];

const whyUsFeatures = [
  {
    title: "Real-Time Analytics Engine",
    description:
      "Every transaction you create, update, or delete immediately recalculates your total transaction count, credit/debit breakdown, and average spend.",
    icon: TrendingUp,
    tag: "Live Metrics",
    accent: "from-emerald-400/25 to-teal-500/20 text-emerald-300 border-emerald-400/30",
  },
  {
    title: "Bank-Grade Account Security",
    description:
      "Your financial records are safeguarded with industry-standard encryption, strict privacy controls, and dedicated account protection at every layer.",
    icon: ShieldCheck,
    tag: "Protected Data",
    accent: "from-blue-400/25 to-indigo-500/20 text-blue-200 border-blue-400/30",
  },
  {
    title: "Precision Ledger Filtering",
    description:
      "Drill down into your financial history with instant Credit and Debit segmented filters, customizable page sizes, and lightning-fast server pagination.",
    icon: SlidersHorizontal,
    tag: "Smart Ledger",
    accent: "from-amber-400/25 to-orange-500/20 text-amber-300 border-amber-400/30",
  },
  {
    title: "Frictionless CRUD Workflow",
    description:
      "Designed for speed—open a modal, record or edit an entry with real-time validation, and get back to your day in seconds with zero page reloads.",
    icon: Zap,
    tag: "Built for Speed",
    accent: "from-purple-400/25 to-indigo-500/20 text-purple-200 border-purple-400/30",
  },
  {
    title: "Cross-Device Responsive UI",
    description:
      "Whether you are reviewing monthly numbers on an ultrawide monitor or logging a receipt on your phone, every table and card adapts gracefully.",
    icon: Smartphone,
    tag: "Every Screen",
    accent: "from-cyan-400/25 to-blue-500/20 text-cyan-200 border-cyan-400/30",
  },
  {
    title: "Zero Clutter, Pure Signal",
    description:
      "No intrusive ads, confusing upsells, or bloated menus. Just a crisp, high-contrast financial workspace focused entirely on your money.",
    icon: Layers,
    tag: "Focused Design",
    accent: "from-rose-400/25 to-pink-500/20 text-rose-200 border-rose-400/30",
  },
];

const faqItems = [
  {
    question: "Is FinanceTracker really free to use?",
    answer:
      "Yes! Creating a personal account, recording unlimited credit and debit transactions, and accessing real-time analytics on your dashboard are completely free with no credit card required.",
  },
  {
    question: "How is my financial data kept secure?",
    answer:
      "Your account is protected with 256-bit encryption, secure authentication, and strict privacy isolation so only you can view and manage your personal financial records.",
  },
  {
    question: "Can I edit or delete a transaction after recording it?",
    answer:
      "Absolutely. From your Transactions page, every row includes dedicated Update and Delete actions. Modifying or removing a record immediately updates your transaction ledger and recalculates your analytics cards.",
  },
  {
    question: "What is the difference between Credit and Debit transactions?",
    answer:
      "Credit transactions represent money coming in (such as salary, freelance retainers, refunds, or dividends), while Debit transactions represent money going out (such as groceries, subscriptions, rent, or utilities).",
  },
  {
    question: "Can I filter my transactions or customize my profile later?",
    answer:
      "Yes. You can filter your transactions by All, Credit, or Debit and adjust how many rows appear per page. In Settings, you can also update your profile photo, display name, phone number, and account password at any time.",
  },
];

const Home: FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 space-y-24 sm:space-y-32 z-10">
      {/* =========================================================
          SECTION 1: HERO & FLOATING LIVE DASHBOARD PREVIEW
      ========================================================= */}
      <section className="w-full flex flex-col items-center">
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
            track every credit and debit in real time, and achieve your
            financial goals with complete peace of mind.
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
          <div className="relative backdrop-blur-2xl bg-slate-900/45 border border-white/25 shadow-2xl shadow-blue-950/50 rounded-3xl p-6 sm:p-8 text-white overflow-hidden">
            {/* Card Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
              <div>
                <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">
                  Total Transactions Volume
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
                      <p className="text-sm font-semibold text-white">
                        {t.name}
                      </p>
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
          <div className="hidden lg:flex absolute -left-12 -bottom-6 bg-slate-900/75 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl px-4 py-3 items-center gap-3 text-xs text-white">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold">SafeGuard Active</p>
              <p className="text-white/70 text-[11px]">
                All transactions verified
              </p>
            </div>
          </div>

          <div className="hidden lg:flex absolute -right-12 -top-6 bg-slate-900/75 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl px-4 py-3 items-center gap-3 text-xs text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold">Automated Sync</p>
              <p className="text-white/70 text-[11px]">
                Instant categorization
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          SECTION 2: PLATFORM METRICS & TRUST STRIP
      ========================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        aria-label="Platform highlights"
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {platformMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-3xl p-6 text-white shadow-xl shadow-blue-950/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {metric.value}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-blue-200">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-bold text-white">{metric.label}</p>
              <p className="text-xs text-blue-100/75 mt-1">{metric.detail}</p>
            </div>
          );
        })}
      </motion.section>

      {/* =========================================================
          SECTION 3: HOW IT WORKS
      ========================================================= */}
      <section
        id="how-it-works"
        className="w-full scroll-mt-24 space-y-12 sm:space-y-16"
      >
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 border border-white/25 text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            From sign-up to financial clarity in{" "}
            <span className="text-blue-200">three simple steps</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-blue-100/85 leading-relaxed">
            No complex accounting jargon or manual spreadsheets. We streamlined
            the entire workflow so you can focus on building wealth.
          </p>
        </motion.div>

        {/* 3-Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 relative">
          {howItWorksSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative group backdrop-blur-2xl bg-slate-950/40 hover:bg-slate-950/55 border border-white/20 hover:border-white/35 rounded-3xl p-7 sm:p-8 text-white shadow-2xl shadow-blue-950/30 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Top Row: Step Number & Badge */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-white/30 flex items-center justify-center text-white shadow-lg shadow-blue-950/40">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-blue-200">
                        {item.badge}
                      </span>
                    </div>

                    <span className="text-3xl sm:text-4xl font-black text-white/15 group-hover:text-white/30 transition-colors select-none">
                      {item.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-blue-100/80 mt-2.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Highlights Checklist */}
                <div className="mt-6 pt-5 border-t border-white/15 space-y-2">
                  {item.highlights.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 text-xs font-medium text-blue-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 4: WHY CHOOSE US
      ========================================================= */}
      <section
        id="why-us"
        className="w-full scroll-mt-24 space-y-12 sm:space-y-16"
      >
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 border border-white/25 text-blue-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Why Choose FinanceTracker
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Engineered for accuracy, speed, and complete control
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-blue-100/85 leading-relaxed">
              Every detail of FinanceTracker is crafted to give you an
              institutional-grade ledger with consumer-friendly simplicity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={APP_PATHS.FEATURES}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-lg shadow-blue-950/30 transition-all duration-200 cursor-pointer"
            >
              <span>Explore All Features</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={APP_PATHS.ABOUT_US}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <span>More About Us</span>
            </Link>
          </div>
        </motion.div>

        {/* 6-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyUsFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/35 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-blue-950/20 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br border flex items-center justify-center shadow-inner ${feature.accent}`}
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

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-blue-200 group-hover:text-white transition-colors">
                  <span>Included in all accounts</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          SECTION 5: FREQUENTLY ASKED QUESTIONS (FAQs)
      ========================================================= */}
      <section
        id="faqs"
        className="w-full scroll-mt-24 space-y-12 sm:space-y-14"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 border border-white/25 text-blue-100">
            <HelpCircle className="w-3.5 h-3.5 text-blue-200" />
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-blue-100/85 leading-relaxed">
            Everything you need to know about how FinanceTracker protects your
            account and helps you stay on top of your transactions.
          </p>
        </motion.div>

        {/* Accordion Container */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqItems.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className={`backdrop-blur-2xl rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-slate-950/55 border-white/35 shadow-xl shadow-blue-950/30"
                    : "bg-white/10 hover:bg-white/15 border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 text-white cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 ${
                      isOpen
                        ? "bg-white text-blue-900 border-white rotate-180"
                        : "bg-white/10 text-white border-white/20"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-blue-100/85 leading-relaxed border-t border-white/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Link to dedicated /faqs page */}
        <div className="text-center pt-2">
          <Link
            href={APP_PATHS.FAQS}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-xs sm:text-sm font-semibold text-white transition-all duration-200 cursor-pointer"
          >
            <span>Have more questions? Visit our dedicated FAQs page</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* =========================================================
          SECTION 6: BOTTOM CALL-TO-ACTION BANNER
      ========================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-slate-950/65 via-blue-950/60 to-indigo-950/65 border border-white/25 p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl shadow-blue-950/50">
          {/* Decorative glow orbs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 border border-white/25 text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Ready When You Are
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Take full command of every transaction today.
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-blue-100/85 max-w-2xl mx-auto leading-relaxed">
              Join FinanceTracker in seconds, start logging your credits and
              debits, and experience financial clarity with zero complexity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <Link
                href={APP_PATHS.SIGN_UP}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-blue-900 font-bold text-base shadow-xl shadow-blue-950/40 hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Create Your Free Account</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={APP_PATHS.FEATURES}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/25 transition-all duration-200 cursor-pointer"
              >
                <span>See All Features</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
