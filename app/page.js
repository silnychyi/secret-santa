import { Suspense } from "react";
import PageContent from "@/components/PageContent";

export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
