"use client";

import type { ReactNode } from "react";
import { ReadingControls } from "@/components/reading-controls";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="no-print mx-auto flex max-w-3xl justify-end px-3 pt-2">
        <ReadingControls />
      </div>
      {children}
    </>
  );
}
