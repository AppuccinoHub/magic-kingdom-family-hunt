"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => {
      setReduce(media.matches || document.documentElement.dataset.motion === "reduce");
    };
    read();
    media.addEventListener("change", read);
    window.addEventListener("mk-reading", read);
    return () => {
      media.removeEventListener("change", read);
      window.removeEventListener("mk-reading", read);
    };
  }, []);

  return reduce;
}
