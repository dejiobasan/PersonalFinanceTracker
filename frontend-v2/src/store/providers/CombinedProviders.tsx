"use client";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import ReduxProvider from "./ReduxProvider";
import { PageLoader } from "@/components/shared";

const queryClient = new QueryClient();

function CombinedProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <ReduxProvider>
        {children}
        <PageLoader />
      </ReduxProvider>
    </QueryClientProvider>
  );
}

export { CombinedProviders };
export default CombinedProviders;
