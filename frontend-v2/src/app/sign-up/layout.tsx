import { AuthLayout } from "@/components";
import { ReactNode } from "react";

export default function SignUpLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
