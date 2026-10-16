import { Suspense } from "react";
import { ResetPassword } from "@/features";
import { PageLoader } from "@/components/shared";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ResetPassword />
    </Suspense>
  );
}
