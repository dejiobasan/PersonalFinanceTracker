import { AppLayout } from "@/components";
import { ReactNode } from "react";

export default function FeaturesLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

