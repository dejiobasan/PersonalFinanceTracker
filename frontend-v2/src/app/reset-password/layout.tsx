import { AuthLayout } from "@/components";
import { ReactNode } from "react";

export default function ResetPasswordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
