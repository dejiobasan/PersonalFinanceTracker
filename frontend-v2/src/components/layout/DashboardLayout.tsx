"use client";

import { FC, ReactNode, useState, useCallback } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const handleCloseMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const handleToggle = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsDesktopCollapsed((prev) => !prev);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar: Persistent on Desktop, Slide-over drawer on Mobile */}
      <DashboardSidebar
        isOpen={isMobileOpen}
        isDesktopCollapsed={isDesktopCollapsed}
        onClose={handleCloseMobile}
        onToggleDesktop={() => setIsDesktopCollapsed((prev) => !prev)}
      />

      {/* Main Content Area: Offset by sidebar width on desktop */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isDesktopCollapsed ? "lg:pl-0" : "lg:pl-64 xl:pl-72"
        }`}
      >
        {/* Header: Sticky on top with route title & user profile */}
        <DashboardHeader
          onOpenSidebar={handleToggle}
          isDesktopCollapsed={isDesktopCollapsed}
        />

        {/* Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;