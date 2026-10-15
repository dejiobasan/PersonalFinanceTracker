import { Suspense } from "react";
import { VerifyOtp } from "@/features";
import { PageLoader } from "@/components/shared";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <VerifyOtp />
    </Suspense>
  );
}
