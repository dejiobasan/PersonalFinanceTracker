import { Suspense } from "react";
import { ForgotPassword } from "@/features";
import { PageLoader } from "@/components/shared";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ForgotPassword />
    </Suspense>
  );
}
