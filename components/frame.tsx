import type { ReactNode } from "react";

export function Frame({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="mx-auto w-full min-w-0 max-w-3xl px-3 py-4">
      <div className="min-w-0">{children}</div>
    </main>
  );
}
