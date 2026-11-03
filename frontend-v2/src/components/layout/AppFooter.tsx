"use client";

import { FC } from "react";
import Link from "next/link";
import {
  Wallet,
  ShieldCheck,
  Lock,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { APP_PATHS } from "@/constants";

const exploreLinks = [
  { label: "Home Overview", href: APP_PATHS.HOME },
  { label: "About Us", href: APP_PATHS.ABOUT_US },
  { label: "Platform Features", href: APP_PATHS.FEATURES },
  { label: "Frequently Asked Questions", href: APP_PATHS.FAQS },
];

const sectionLinks = [
  { label: "How It Works", href: `${APP_PATHS.HOME}#how-it-works` },
  { label: "Why Choose Us", href: `${APP_PATHS.HOME}#why-us` },
  { label: "Common Questions", href: `${APP_PATHS.HOME}#faqs` },
];

const accountLinks = [
  { label: "Create Free Account", href: APP_PATHS.SIGN_UP },
  { label: "Sign In to Account", href: APP_PATHS.LOGIN },
  { label: "User Dashboard", href: APP_PATHS.DASHBOARD },
  { label: "My Transactions", href: APP_PATHS.TRANSACTIONS },
];

const AppFooter: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 w-full mt-auto pt-12">
      <div className=" backdrop-blur-2xl bg-slate-950/55 border-t border-white/15 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/15">
            {/* Brand Column */}
            <div className="lg:col-span-5 space-y-5">
              <Link
                href={APP_PATHS.HOME}
                className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-xl cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner group-hover:bg-white/25 transition-all duration-200">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white flex items-center">
                  Finance
                  <span className="text-blue-300 font-extrabold ml-0.5">
                    Tracker
                  </span>
                </span>
              </Link>

              <p className="text-sm text-blue-100/80 max-w-md leading-relaxed">
                The modern personal finance command center engineered to help
                you record every credit and debit, monitor real-time cashflow
                analytics, and build lasting financial clarity.
              </p>

              {/* Status & Trust Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  All Systems Operational
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-blue-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                  256-Bit Encrypted
                </span>
              </div>
            </div>

            {/* Explore Links */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Explore
              </h3>
              <ul className="space-y-2.5 text-sm">
                {exploreLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-blue-100/75 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer group"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all text-blue-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Home Sections */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200">
                On This Page
              </h3>
              <ul className="space-y-2.5 text-sm">
                {sectionLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-blue-100/75 hover:text-white transition-colors cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account & Access */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Account & Portal
              </h3>
              <ul className="space-y-2.5 text-sm">
                {accountLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-blue-100/75 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer group"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-300" />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-200 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">100% Free Personal Plan</p>
                    <p className="text-blue-200/70">Unlimited transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/70">
            <p>
              &copy; {currentYear} FinanceTracker. Crafted for effortless
              personal wealth management.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-5">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-300" />
                Zero Third-Party Data Selling
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Real-Time Cloud Sync
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                Verified Account Protection
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;

