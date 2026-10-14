import { AuthLayout } from "@/components";
import { ReactNode } from "react";

export default function ForbiddenLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
