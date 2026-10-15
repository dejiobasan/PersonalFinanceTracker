"use client";

import { FC, useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Settings,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { APP_PATHS } from "@/constants";
import { Role } from "@/enums";
import { useAppSelector } from "@/store/hook";
import { selectAuthUser } from "@/store/slices/authSlice";
import { useLogout } from "@/hooks";

interface DashboardHeaderProps {
  onOpenSidebar?: () => void;
  isDesktopCollapsed?: boolean;
}

interface RouteMeta {
  title: string;
  category: string;
}

const ROUTE_MAP: Record<string, RouteMeta> = {
  [APP_PATHS.DASHBOARD]: {
    title: "Dashboard",
    category: "Overview",
  },
  [APP_PATHS.TRANSACTIONS]: {
    title: "Transactions",
    category: "Finance",
  },
  [APP_PATHS.SETTINGS]: {
    title: "Account Settings",
    category: "Preferences",
  },
  [APP_PATHS.TRANSACTIONS_MANAGEMENT]: {
    title: "Transaction Management",
    category: "Admin Portal",
  },
  [APP_PATHS.USER_MANAGEMENT]: {
    title: "User Management",
    category: "Admin Portal",
  },
};

const getInitials = (name?: string | null): string => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const DashboardHeader: FC<DashboardHeaderProps> = ({ onOpenSidebar }) => {
  const pathname = usePathname();
  const user = useAppSelector(selectAuthUser);
  const { logout } = useLogout();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute route metadata based on current pathname
  const routeMeta = useMemo((): RouteMeta => {
    if (ROUTE_MAP[pathname]) {
      return ROUTE_MAP[pathname];
    }

    // Dynamic fallback for any nested sub-paths
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      return { title: "Dashboard", category: "Overview" };
    }

    const lastSegment = segments[segments.length - 1];
    const formattedTitle = lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      title: formattedTitle,
      category: segments.length > 1 ? "Pages" : "Overview",
    };
  }, [pathname]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Close dropdown on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsDropdownOpen(false);
  }

  const handleLogout = async () => {
    await logout();
  };

  const isAdmin = user?.role === Role.ADMIN || user?.role?.toUpperCase() === "ADMIN";
  const userInitials = getInitials(user?.name);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Top Left: Mobile Menu Button & Route Name */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Menu Toggle Button */}
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Toggle navigation sidebar"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Route Breadcrumb & Title */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-0.5 truncate">
              <span>Pages</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-700 font-semibold truncate">
                {routeMeta.category}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
              {routeMeta.title}
            </h1>
          </div>
        </div>

        {/* Top Right: User Profile & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-2.5 sm:gap-3 p-1.5 sm:py-1.5 sm:px-2.5 rounded-full sm:rounded-xl hover:bg-slate-100/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group cursor-pointer"
            >
              {/* User Avatar with Image or Fallback */}
              <div className="relative">
                {user?.userImage && !imageError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.userImage}
                    alt={user.name || "User Avatar"}
                    onError={() => setImageError(true)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-blue-500/20 shadow-xs"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xs ring-2 ring-blue-500/20">
                    {userInitials ? (
                      <span className="text-xs sm:text-sm font-bold tracking-tight">
                        {userInitials}
                      </span>
                    ) : (
                      <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/95" />
                    )}
                  </div>
                )}
                {/* Status Dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              {/* User Name and Role (hidden on small mobile screens) */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors max-w-[130px] truncate">
                  {user?.name || "User"}
                </span>
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  {isAdmin ? (
                    <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-amber-500" />
                      Admin
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-0.5">
                      <UserCheck className="w-3 h-3 text-blue-500" />
                      Member
                    </span>
                  )}
                </span>
              </div>

              <ChevronDown
                className={`hidden sm:block w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl shadow-slate-900/10 border border-slate-200/80 py-2 z-50 overflow-hidden"
                >
                  {/* User info card */}
                  <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {user?.email || "No email available"}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isAdmin
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {isAdmin ? (
                          <>
                            <ShieldCheck className="w-3 h-3" />
                            Administrator
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3" />
                            Standard Member
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="px-2 py-1.5 space-y-0.5">
                    <Link
                      href={APP_PATHS.SETTINGS}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Account Settings</span>
                    </Link>
                  </div>

                  <div className="my-1 border-t border-slate-100" />

                  {/* Sign Out */}
                  <div className="px-2 py-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50/70 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
