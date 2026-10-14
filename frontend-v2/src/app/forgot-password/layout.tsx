import { AuthLayout } from "@/components";
import { ReactNode } from "react";

export default function ForgotPasswordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
