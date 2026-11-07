"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CertificateView } from "@/components/certificate-view";
import { Frame } from "@/components/frame";
import { Button } from "@/components/ui/button";
import { loadCurrentHunt } from "@/lib/load-hunt";
import { phonePhoto } from "@/lib/phone-db";
import type { HuntState } from "@/lib/types";

export default function CertificatePage() {
  const [state, setState] = useState<HuntState | null>(null);
  const [missing, setMissing] = useState(false);
  const [urls, setUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancel = false;
    loadCurrentHunt()
      .then((hunt) => {
        if (cancel) return;
        if (!hunt) setMissing(true);
        else setState(hunt);
      })
      .catch(() => {
        if (!cancel) setMissing(true);
      });
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!state?.phoneOnly) return;
    let cancel = false;
    const created: string[] = [];
    (async () => {
      const next: Record<number, string> = {};
      for (const challenge of state.challenges) {
        if (!challenge.hasPhoto) continue;
        const blob = await phonePhoto(state.hunt.id, challenge.index);
        if (!blob) continue;
        const url = URL.createObjectURL(blob);
        created.push(url);
        next[challenge.index] = url;
      }
      if (!cancel) setUrls(next);
    })();
    return () => {
      cancel = true;
      created.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [state]);

  if (missing) {
    return (
      <Frame>
        <h1 className="text-4xl font-bold">No hunt on this phone yet</h1>
        <Button asChild className="mt-4">
          <Link href="/">Go to the start</Link>
        </Button>
      </Frame>
    );
  }
  if (!state) {
    return (
      <Frame>
        <h1 className="text-4xl font-bold">Opening your certificate…</h1>
      </Frame>
    );
  }
  return (
    <Frame>
      <CertificateView
        state={state}
        photoSrc={(index) => {
          if (!state.challenges[index]?.hasPhoto) return undefined;
          if (state.phoneOnly) return urls[index];
          return `/api/hunt/photos/${index}?v=${state.rev}`;
        }}
      />
    </Frame>
  );
}
