"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wallet,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CreditCard,
  LogIn,
  UserPlus,
} from "lucide-react";
import { APP_PATHS } from "@/constants";

const navItems = [
  { name: "Overview", href: APP_PATHS.HOME, icon: Sparkles },
  { name: "Features", href: "#features", icon: CreditCard },
  { name: "Security", href: "#security", icon: ShieldCheck },
];

const AppHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close when window resized to desktop (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle ESC key to dismiss sidebar & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header className="w-full px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6">
      <nav
        aria-label="Main Navigation"
        className="max-w-7xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-blue-950/20 rounded-2xl px-5 sm:px-8 py-3.5 flex items-center justify-between transition-all duration-300"
      >
        {/* Brand / Logo */}
        <Link
          href={APP_PATHS.HOME}
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-xl"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner group-hover:bg-white/25 group-hover:scale-105 transition-all duration-200">
            <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-white transition-transform duration-200 group-hover:rotate-6" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center">
            Finance
            <span className="text-blue-200 font-extrabold ml-0.5">Tracker</span>
          </span>
        </Link>

        {/* Desktop Navigation Links (>= 1024px) */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-white/80 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth CTAs (>= 1024px) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href={APP_PATHS.LOGIN}
            className="text-sm font-semibold text-white/90 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            Log In
          </Link>
          <Link
            href={APP_PATHS.SIGN_UP}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-blue-900 hover:bg-blue-50 px-5 py-2.5 rounded-xl shadow-lg shadow-black/15 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Sign Up</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Hamburger Toggle Button (visible on 768px screens and below) */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile & Tablet Full-screen Sidebar (Portaled to body to ensure full screen coverage) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm"
                  aria-hidden="true"
                />

                {/* Sidebar Drawer covering the screen */}
                <motion.aside
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed inset-0 w-full h-full h-dvh bg-gradient-to-b from-blue-950 via-slate-900 to-blue-950 text-white shadow-2xl flex flex-col justify-between p-6 sm:p-10 overflow-y-auto z-10"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile Navigation"
                >
                  {/* Top Header */}
                  <div className="w-full max-w-lg mx-auto">
                    <div className="flex items-center justify-between pb-6 border-b border-white/15">
                      <Link
                        href={APP_PATHS.HOME}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3"
                      >
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-inner">
                          <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-white">
                          Finance
                          <span className="text-blue-300 font-extrabold ml-0.5">
                            Tracker
                          </span>
                        </span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                        aria-label="Close menu"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Nav Links */}
                    <div className="py-8 flex flex-col gap-3">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-blue-300">
                              <Icon className="h-5 w-5" />
                            </div>
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-6 border-t border-white/15 flex flex-col gap-3.5 w-full max-w-lg mx-auto">
                    <Link
                      href={APP_PATHS.LOGIN}
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-colors text-base"
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Log In</span>
                    </Link>

                    <Link
                      href={APP_PATHS.SIGN_UP}
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold bg-white text-blue-900 hover:bg-blue-50 shadow-lg shadow-black/20 transition-all text-base"
                    >
                      <UserPlus className="h-5 w-5" />
                      <span>Sign Up</span>
                    </Link>

                    <div className="mt-2 text-center">
                      <p className="text-xs text-white/50 flex items-center justify-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-blue-300" />
                        Bank-grade 256-bit encryption
                      </p>
                    </div>
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
};

export default AppHeader;
