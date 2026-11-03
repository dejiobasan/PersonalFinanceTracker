import { AppLayout } from "@/components";
import { ReactNode } from "react";

export default function AboutUsLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

