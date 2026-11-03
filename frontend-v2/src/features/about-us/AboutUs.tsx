"use client";

import { FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Target,
  Compass,
  HeartHandshake,
  Zap,
  Lock,
  Layers,
  TrendingUp,
  CheckCircle2,
  Users,
  Award,
  Clock,
} from "lucide-react";
import { APP_PATHS } from "@/constants";

const impactStats = [
  {
    value: "100%",
    label: "Free Personal Plan",
    detail: "No subscriptions or hidden fees",
    icon: Award,
  },
  {
    value: "256-Bit",
    label: "Encrypted Protection",
    detail: "Strict privacy isolation",
    icon: ShieldCheck,
  },
  {
    value: "< 50ms",
    label: "Real-Time Sync",
    detail: "Instant ledger & analytics updates",
    icon: Zap,
  },
  {
    value: "24/7",
    label: "Cloud Availability",
    detail: "Accessible on every device",
    icon: Clock,
  },
];

const coreValues = [
  {
    title: "Simplicity by Default",
    description:
      "Personal finance shouldn't require an accounting degree. We strip away bloated menus and complex jargon so you can record and review transactions in seconds.",
    icon: Layers,
    accent: "from-blue-400/25 to-indigo-500/20 text-blue-200 border-blue-400/30",
  },
  {
    title: "Uncompromising Privacy",
    description:
      "Your financial life is yours alone. We never sell your data, display intrusive advertisements, or share your transaction history with third parties.",
    icon: Lock,
    accent:
      "from-emerald-400/25 to-teal-500/20 text-emerald-300 border-emerald-400/30",
  },
  {
    title: "Real-Time Transparency",
    description:
      "Every credit and debit you log immediately updates your total counts and average transaction metrics—giving you an honest, up-to-the-second picture of your cashflow.",
    icon: TrendingUp,
    accent:
      "from-amber-400/25 to-orange-500/20 text-amber-300 border-amber-400/30",
  },
  {
    title: "User-First Craftsmanship",
    description:
      "From responsive tables and instant type filters to thoughtful keyboard navigation, every interaction is engineered to feel fast, reliable, and effortless.",
    icon: HeartHandshake,
    accent:
      "from-purple-400/25 to-indigo-500/20 text-purple-200 border-purple-400/30",
  },
];

const pillars = [
  "Instant credit and debit transaction logging with zero friction",
  "Live dashboard metrics that recalculate automatically on every change",
  "Full record ownership with one-click update and delete controls",
  "Clean, distraction-free workspace designed for desktop and mobile",
];

const AboutUs: FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 space-y-20 sm:space-y-28 z-10">
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
          <Users className="w-4 h-4 text-blue-200" />
          <span>Our Story & Mission</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12]"
        >
          Redefining personal finance with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200">
            clarity and precision
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="text-base sm:text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed"
        >
          We built FinanceTracker because managing everyday income and expenses
          should feel empowering—not like wrestling with fragile spreadsheets or
          overcomplicated banking portals.
        </motion.p>
      </section>

      {/* =========================================================
          IMPACT METRICS STRIP
      ========================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        aria-label="Platform impact metrics"
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {impactStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-3xl p-6 text-white shadow-xl shadow-blue-950/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {stat.value}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-blue-200">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-bold text-white">{stat.label}</p>
              <p className="text-xs text-blue-100/75 mt-1">{stat.detail}</p>
            </div>
          );
        })}
      </motion.section>

      {/* =========================================================
          MISSION & VISION SPLIT CARDS
      ========================================================= */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Mission Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-2xl bg-slate-950/45 border border-white/25 rounded-3xl p-7 sm:p-10 text-white shadow-2xl shadow-blue-950/35 flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 border border-blue-400/30 text-blue-200">
              <Target className="w-4 h-4 text-blue-300" />
              <span>Our Mission</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Give every individual effortless command over their daily cashflow
            </h2>

            <p className="text-sm sm:text-base text-blue-100/85 leading-relaxed">
              Most financial tools fall into two extremes: overly simplistic
              notes that offer zero insight, or enterprise accounting suites
              that take hours to configure. Our mission is to bridge that gap
              with a fast, intuitive ledger that turns raw transactions into
              instant clarity.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-3 text-xs sm:text-sm font-semibold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Built for everyday clarity, speed, and accuracy</span>
          </div>
        </motion.div>

        {/* Vision Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="backdrop-blur-2xl bg-white/10 border border-white/25 rounded-3xl p-7 sm:p-10 text-white shadow-2xl shadow-blue-950/30 flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 border border-white/25 text-blue-100">
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>Our Vision</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              A world where financial confidence is accessible to everyone
            </h2>

            <p className="text-sm sm:text-base text-blue-100/85 leading-relaxed">
              When you know exactly where your money comes from and where it
              goes, financial stress disappears. We envision a personal finance
              experience that stays out of your way while keeping your most
              important numbers—credits, debits, and averages—always at your
              fingertips.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-3 text-xs sm:text-sm font-semibold text-blue-200">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Designed to scale with your personal financial journey</span>
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          CORE VALUES SECTION
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
            Core Principles
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            The values behind every line of code
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-blue-100/85 leading-relaxed">
            Four non-negotiable standards guide how we design, build, and
            maintain FinanceTracker.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreValues.map((value, idx) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/35 rounded-3xl p-7 sm:p-8 text-white shadow-xl shadow-blue-950/20 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br border flex items-center justify-center mb-5 ${value.accent}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-white">{value.title}</h3>
                <p className="text-sm text-blue-100/80 mt-2.5 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          HOW WE DIFFERENTIATE / STORY HIGHLIGHT
      ========================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
        className="w-full backdrop-blur-2xl bg-slate-950/45 border border-white/25 rounded-3xl p-7 sm:p-10 lg:p-12 text-white shadow-2xl shadow-blue-950/35"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
              Built for Real Life
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Why we replaced manual spreadsheets with a dedicated command center
            </h2>
            <p className="text-sm sm:text-base text-blue-100/85 leading-relaxed">
              Spreadsheets break when formulas get overwritten, and generic note
              apps can&apos;t tell you your average transaction size or your
              credit-to-debit ratio. FinanceTracker gives you a structured,
              purpose-built ledger that validates every entry and keeps your
              analytics continuously synchronized.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-3 bg-white/5 border border-white/15 rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-3">
              What You Get Out of the Box
            </p>
            {pillars.map((pillar) => (
              <div
                key={pillar}
                className="flex items-start gap-3 text-xs sm:text-sm text-blue-100"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>{pillar}</span>
              </div>
            ))}
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
              Start tracking your finances with confidence.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-blue-100/85 max-w-2xl mx-auto leading-relaxed">
              Create your free personal account in seconds or explore our full
              suite of transaction management capabilities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={APP_PATHS.SIGN_UP}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-blue-900 font-bold text-base shadow-xl shadow-blue-950/40 hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>Get Started For Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={APP_PATHS.FEATURES}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/25 transition-all duration-200 cursor-pointer"
              >
                <span>Explore Features</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;

