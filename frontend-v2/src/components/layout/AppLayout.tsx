"use client";

import { BgShape } from "@/app/assets";
import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-blue-600 flex flex-col overflow-x-hidden">
      <div
        className="fixed inset-0 bg-no-repeat bg-cover bg-center z-0 pointer-events-none"
        style={{ backgroundImage: `url(${BgShape.src})` }}
      />

      <div className="relative z-20 w-full">
        <AppHeader />
      </div>

      <main className="relative z-10 flex-1 flex flex-col">{children}</main>

      <AppFooter />
    </div>
  );
};

export default AppLayout;
