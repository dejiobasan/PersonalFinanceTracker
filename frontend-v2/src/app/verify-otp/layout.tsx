import { AuthLayout } from "@/components";
import { ReactNode } from "react";

export default function VerifyEmailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
