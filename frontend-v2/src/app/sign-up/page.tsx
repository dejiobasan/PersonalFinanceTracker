import { Suspense } from "react";
import { SignUp } from "@/features";
import { PageLoader } from "@/components/shared";

export default function SignUpPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SignUp />
    </Suspense>
  );
}
