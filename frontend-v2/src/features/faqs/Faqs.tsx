"use client";

import { FC, useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { APP_PATHS } from "@/constants";

type FaqCategory =
  | "ALL"
  | "Getting Started"
  | "Transactions & Ledger"
  | "Analytics & Insights"
  | "Account & Privacy";

interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, "ALL">;
  question: string;
  answer: string;
}

const CATEGORIES: { label: string; value: FaqCategory }[] = [
  { label: "All Questions", value: "ALL" },
  { label: "Getting Started", value: "Getting Started" },
  { label: "Transactions & Ledger", value: "Transactions & Ledger" },
  { label: "Analytics & Insights", value: "Analytics & Insights" },
  { label: "Account & Privacy", value: "Account & Privacy" },
];

const FAQ_DATA: FaqItem[] = [
  {
    id: "free-plan",
    category: "Getting Started",
    question: "Is FinanceTracker completely free for personal use?",
    answer:
      "Yes. Creating your personal account, logging unlimited credit and debit transactions, and viewing real-time analytics on your dashboard are 100% free with no credit card required.",
  },
  {
    id: "onboarding-speed",
    category: "Getting Started",
    question: "How quickly can I set up my account and start logging?",
    answer:
      "Registration takes less than a minute. Simply provide your full name, email address, phone number, and password, and your personal workspace is ready to start recording transactions immediately.",
  },
  {
    id: "credit-vs-debit",
    category: "Transactions & Ledger",
    question: "What is the difference between Credit and Debit transactions?",
    answer:
      "Credit transactions represent incoming funds (such as salary payments, consulting retainers, dividends, or refunds), whereas Debit transactions represent outgoing expenses (such as groceries, rent, utilities, or subscriptions).",
  },
  {
    id: "create-transaction",
    category: "Transactions & Ledger",
    question: "How do I record a new transaction?",
    answer:
      "Navigate to the Transactions page from your dashboard sidebar and click the 'Create Transaction' button at the top. Choose Credit or Debit, enter a description and amount, and submit—your table and analytics cards will update immediately.",
  },
  {
    id: "edit-delete-transaction",
    category: "Transactions & Ledger",
    question: "Can I update or delete a transaction if I make a mistake?",
    answer:
      "Yes! Every row in your Transactions table includes dedicated Update and Delete buttons. Clicking Update opens the modal pre-filled with that transaction's details so you can adjust the description, amount, or type. Clicking Delete asks for confirmation before permanently removing the entry.",
  },
  {
    id: "filter-pagination",
    category: "Transactions & Ledger",
    question: "How can I filter or browse through a large number of transactions?",
    answer:
      "You can filter your ledger by All, Credit, or Debit using the segmented filter bar at the top of your Transactions table. You can also navigate across pages or switch between 10, 20, or 50 rows per page at the bottom of the table.",
  },
  {
    id: "analytics-calculation",
    category: "Analytics & Insights",
    question: "How are the top analytics cards calculated?",
    answer:
      "FinanceTracker automatically aggregates your records to display four live metrics: Total Transactions (all entries recorded), Total Credit (count of income entries), Total Debit (count of expense entries), and Average Transaction (the mean value across all your recorded transactions).",
  },
  {
    id: "analytics-sync",
    category: "Analytics & Insights",
    question: "Do I need to refresh the page after adding or editing a transaction?",
    answer:
      "No page reload is needed. Whenever you create, update, or delete a transaction, your transaction table and top analytics cards automatically refresh in the background.",
  },
  {
    id: "data-privacy",
    category: "Account & Privacy",
    question: "Who can see my financial transactions?",
    answer:
      "Your personal ledger is strictly isolated to your account. We use 256-bit encryption in transit, never display third-party ads, and never sell your financial history.",
  },
  {
    id: "profile-settings",
    category: "Account & Privacy",
    question: "Can I update my profile picture, phone number, or password?",
    answer:
      "Yes. Visit the Settings page in your dashboard to upload or change your profile avatar (PNG, JPG, JPEG, or HEIC up to 5MB), update your display name or phone number, or change your account password.",
  },
];

const Faqs: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;
      const matchesQuery =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSearchQuery("");
  };

  return (
    <div className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 space-y-16 sm:space-y-24 z-10">
      {/* =========================================================
          HERO & SEARCH BAR
      ========================================================= */}
      <section className="w-full text-center max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-xl shadow-blue-950/20"
        >
          <HelpCircle className="w-4 h-4 text-blue-200" />
          <span>Help & Support Center</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12]"
        >
          Frequently Asked{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200">
            Questions
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="text-base sm:text-lg text-blue-100/90 leading-relaxed"
        >
          Find instant answers about setting up your account, managing credit
          and debit transactions, and understanding your analytics.
        </motion.p>

        {/* Live Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="relative max-w-xl mx-auto pt-2"
        >
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-blue-200 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. credit, analytics, delete, free)..."
              aria-label="Search frequently asked questions"
              className="w-full h-13 pl-12 pr-11 rounded-2xl backdrop-blur-2xl bg-slate-950/45 border border-white/25 focus:border-white text-sm sm:text-base text-white placeholder:text-blue-200/60 shadow-2xl shadow-blue-950/30 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
                className="absolute right-3.5 p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="flex flex-wrap items-center justify-center gap-2 pt-2"
          role="tablist"
          aria-label="FAQ categories"
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-white text-blue-900 shadow-lg shadow-blue-950/30"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* =========================================================
          ACCORDION LIST
      ========================================================= */}
      <section className="w-full max-w-3xl mx-auto space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className={`backdrop-blur-2xl rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-slate-950/55 border-white/35 shadow-xl shadow-blue-950/35"
                    : "bg-white/10 hover:bg-white/15 border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenId((prev) => (prev === faq.id ? null : faq.id))
                  }
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 text-left flex items-start sm:items-center justify-between gap-4 text-white cursor-pointer"
                >
                  <div className="space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 border border-white/15 text-blue-200">
                      {faq.category}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold leading-snug text-white">
                      {faq.question}
                    </h2>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 mt-1 sm:mt-0 ${
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
                      <div className="px-6 pb-5 pt-2 text-xs sm:text-sm text-blue-100/85 leading-relaxed border-t border-white/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="backdrop-blur-2xl bg-slate-950/45 border border-white/25 rounded-3xl p-10 text-center text-white space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-blue-200">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">No matching questions found</h3>
            <p className="text-sm text-blue-100/80 max-w-md mx-auto">
              We couldn&apos;t find any FAQs matching &ldquo;{searchQuery}
              &rdquo; in this category. Try another keyword or reset the
              filters.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs sm:text-sm shadow-lg hover:bg-blue-50 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        )}
      </section>

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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 border border-white/25 text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Ready to Dive In?
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Put FinanceTracker to work for you today.
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-blue-100/85 max-w-2xl mx-auto leading-relaxed">
              Sign up for free in seconds and experience how effortless personal
              transaction management can be.
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

export default Faqs;

