"use client";

import { FC, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  X,
  LayoutDashboard,
  ArrowLeftRight,
  Settings,
  Receipt,
  Users,
  ShieldCheck,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { APP_PATHS } from "@/constants";
import { Role } from "@/enums";
import { useAppSelector } from "@/store/hook";
import { selectAuthUser } from "@/store/slices/authSlice";
import { useLogout, useMounted } from "@/hooks";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktopCollapsed?: boolean;
  onToggleDesktop?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

const mainNavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: APP_PATHS.DASHBOARD,
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Transactions",
    href: APP_PATHS.TRANSACTIONS,
    icon: ArrowLeftRight,
  },
  {
    name: "Settings",
    href: APP_PATHS.SETTINGS,
    icon: Settings,
  },
];

const adminNavItems: NavItem[] = [
  {
    name: "Transactions Mgmt",
    href: APP_PATHS.TRANSACTIONS_MANAGEMENT,
    icon: Receipt,
  },
  {
    name: "User Management",
    href: APP_PATHS.USER_MANAGEMENT,
    icon: Users,
  },
];

export const DashboardSidebar: FC<DashboardSidebarProps> = ({
  isOpen,
  onClose,
  isDesktopCollapsed = false,
}) => {
  const pathname = usePathname();
  const user = useAppSelector(selectAuthUser);
  const { logout } = useLogout();
  const mounted = useMounted();

  const isAdmin =
    user?.role === Role.ADMIN || user?.role?.toUpperCase() === "ADMIN";

  const pathnameRef = useRef(pathname);
  useEffect(() => {
    if (pathnameRef.current !== pathname) {
      pathnameRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
  };

  const isLinkActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  // Reusable sidebar navigation content
  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 sm:h-20 px-6 border-b border-slate-200/80 shrink-0">
        <Link
          href={APP_PATHS.DASHBOARD}
          onClick={() => {
            if (isMobile) onClose();
          }}
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/25 group-hover:bg-blue-700 group-hover:scale-105 transition-all duration-200">
            <Wallet className="w-5 h-5 text-white transition-transform duration-200 group-hover:rotate-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
            Finance
            <span className="text-blue-600 font-extrabold ml-0.5">Tracker</span>
          </span>
        </Link>
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Menu
          </p>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const active = isLinkActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (isMobile) onClose();
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      active ? "text-white" : "text-slate-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {isAdmin && (
          <div className="pt-2">
            <div className="px-3 flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Admin Management
              </p>
              <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 font-bold px-1.5 py-0.2 rounded-full">
                Admin
              </span>
            </div>
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const active = isLinkActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      if (isMobile) onClose();
                    }}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        active ? "text-white" : "text-slate-500"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200/80 bg-slate-50/60 shrink-0">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xs font-bold">
              {user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <UserIcon className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] text-slate-500 capitalize truncate">
                {isAdmin ? "Admin" : "Member"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 bg-white border-r border-slate-200/80 z-20 transition-all duration-300 overflow-hidden ${
          isDesktopCollapsed
            ? "w-0 -translate-x-full border-r-0 opacity-0"
            : "w-64 xl:w-72 translate-x-0 opacity-100"
        }`}
      >
        <div className="w-64 xl:w-72 h-full flex flex-col shrink-0">
          {renderSidebarContent(false)}
        </div>
      </aside>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                key="mobile-sidebar-container"
                className="fixed inset-0 z-50 lg:hidden"
              >
                <motion.div
                  key="mobile-sidebar-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={onClose}
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
                  aria-hidden="true"
                />
                <motion.div
                  key="mobile-sidebar-panel"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 26, stiffness: 260 }}
                  className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Navigation Sidebar"
                >
                  {renderSidebarContent(true)}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export default DashboardSidebar;
