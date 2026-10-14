import { AuthLayout } from "@/components";
import { ReactNode } from "react";

export default function UnauthorizedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
