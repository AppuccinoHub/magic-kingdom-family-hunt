"use client";

import type { ReactNode } from "react";
import { ReadingControls } from "@/components/reading-controls";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="no-print bg-night px-3 py-3 text-white">
        <div className="mx-auto flex max-w-3xl min-w-0 flex-col gap-3">
          <p className="font-display text-2xl leading-tight text-white">Our family adventure</p>
          <ReadingControls />
        </div>
      </header>
      {children}
    </>
  );
}
