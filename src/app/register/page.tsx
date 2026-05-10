import { Suspense } from "react";
import RegisterPageView from "@/src/features/auth/components/RegisterPageView";
import Loading from "./loading";

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterPageView />
    </Suspense>
  );
}
