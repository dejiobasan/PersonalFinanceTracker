import { Suspense } from "react";
import { PageLoader } from "@/components";
import { Login } from "@/features";

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Login />
    </Suspense>
  );
}
