import { AuthLayout } from "@/components";
import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
