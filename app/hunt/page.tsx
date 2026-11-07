"use client";

import { Suspense } from "react";
import { HuntScreen } from "@/components/hunt-screen";

export default function HuntPage() {
  return (
    <Suspense
      fallback={
        <main id="main" className="mx-auto max-w-3xl p-6">
          <h1 className="text-4xl font-bold">Opening your hunt…</h1>
        </main>
      }
    >
      <HuntScreen />
    </Suspense>
  );
}
