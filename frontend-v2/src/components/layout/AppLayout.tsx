"use client";

import { BgShape } from "@/app/assets";
import { ReactNode } from "react";
import AppHeader from "./AppHeader";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-blue-600 flex flex-col overflow-x-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 pointer-events-none"
        style={{ backgroundImage: `url(${BgShape.src})` }}
      ></div>

      <div className="relative z-20 w-full">
        <AppHeader />
      </div>

      <>{children}</>
    </div>
  );
};

export default AppLayout;
