"use client";

import { FC, useState } from "react";
import {
  User,
  KeyRound,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Mail,
} from "lucide-react";

import { useAppSelector } from "@/store/hook";
import { selectAuthUser } from "@/store/slices/authSlice";
import { Role } from "@/enums";
import { ProfileSettingsTab, ChangePasswordTab } from "./components";

type SettingsTabKey = "profile" | "password";

const TABS: {
  key: SettingsTabKey;
  label: string;
  icon: typeof User;
}[] = [
  {
    key: "profile",
    label: "Update Profile",
    icon: User,
  },
  {
    key: "password",
    label: "Change Password",
    icon: KeyRound,
  },
];

const getInitials = (name?: string | null): string => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Settings: FC = () => {
  const user = useAppSelector(selectAuthUser);
  const [activeTab, setActiveTab] = useState<SettingsTabKey>("profile");

  const isAdmin =
    user?.role === Role.ADMIN || user?.role?.toUpperCase() === "ADMIN";

  return (
    <div className="space-y-6">
      {/* Top User Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {user?.userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.userImage}
              alt={user.name || "User Avatar"}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0 shadow-xs"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold shrink-0 shadow-xs ring-2 ring-blue-500/20">
              {getInitials(user?.name)}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                {user?.name || "Account Settings"}
              </h2>
              {user?.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs sm:text-sm text-slate-500">
              {user?.email && (
                <span className="inline-flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {user.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="self-start sm:self-center shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isAdmin
                ? "bg-amber-50 text-amber-800 border border-amber-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Administrator
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                Standard Member
              </>
            )}
          </span>
        </div>
      </div>

      {/* Tab Navigation Bar */}
      <div
        className="inline-flex items-center p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs gap-1"
        role="tablist"
        aria-label="Account settings tabs"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div role="tabpanel">
        {activeTab === "profile" ? (
          <ProfileSettingsTab />
        ) : (
          <ChangePasswordTab />
        )}
      </div>
    </div>
  );
};

export default Settings;
