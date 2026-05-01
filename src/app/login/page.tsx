import { Suspense } from "react";
import { LoginPageView } from "@/src/features/auth/components/LoginPageView";
import Loading from "./loading";

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginPageView />
    </Suspense>
  );
}
