"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CertificateView } from "@/components/certificate-view";
import { Frame } from "@/components/frame";
import { Button } from "@/components/ui/button";
import { jpegForCertificate } from "@/lib/certificate-image";
import { buildCertificatePdf, certificateFilename, type CertificatePdfEntry } from "@/lib/certificate-pdf";
import { CHALLENGES } from "@/lib/challenges";
import { loadCurrentHunt } from "@/lib/load-hunt";
import { phonePhotoBlobs } from "@/lib/phone-db";
import type { HuntState } from "@/lib/types";
import { formatWhen } from "@/lib/utils";

function copyBytes(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy;
}

export default function CertificatePage() {
  const [state, setState] = useState<HuntState | null>(null);
  const [missing, setMissing] = useState(false);
  const [urls, setUrls] = useState<Record<number, string>>({});
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [pdfReady, setPdfReady] = useState(false);
  const [prepareMessage, setPrepareMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

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
    if (!state) return;
    let cancel = false;
    const created: string[] = [];
    (async () => {
      let blobs: Record<number, Blob>;
      try {
        blobs = await phonePhotoBlobs(state.hunt.id);
      } catch {
        if (!cancel) {
          setPdfReady(false);
          setPrepareMessage("This phone could not open the photos for the PDF. They are still saved in this browser. Nothing was erased.");
        }
        return;
      }
      const nextUrls: Record<number, string> = {};
      const entries: CertificatePdfEntry[] = [];
      const omitted: number[] = [];
      for (const challenge of state.challenges) {
        if (!challenge.done) continue;
        let photo: CertificatePdfEntry["photo"] = null;
        if (challenge.hasPhoto) {
          const blob = blobs[challenge.index];
          const prepared = blob ? await jpegForCertificate(blob) : null;
          if (!prepared) omitted.push(challenge.index + 1);
          else {
            photo = prepared;
            const url = URL.createObjectURL(new Blob([copyBytes(prepared.bytes)], { type: "image/jpeg" }));
            created.push(url);
            nextUrls[challenge.index] = url;
          }
        }
        entries.push({
          index: challenge.index,
          text: CHALLENGES[challenge.index].text,
          note: challenge.note,
          stampedBy: challenge.stampedByName ?? "",
          when: formatWhen(challenge.stampedAt),
          photo,
        });
      }
      const bytes = buildCertificatePdf({
        familyName: state.hunt.familyName,
        advisorLine: state.hunt.advisorName.trim() ? `Shared by ${state.hunt.advisorName.trim()}.` : "Shared by your travel advisor.",
        stampCount: state.stampCount,
        bingoLineCount: state.bingoLineCount,
        full: state.stampCount === 25,
        printedAt: formatWhen(new Date().toISOString()),
        entries,
      });
      if (cancel) {
        created.forEach((url) => URL.revokeObjectURL(url));
        return;
      }
      setUrls(nextUrls);
      setPdfBytes(bytes);
      setPdfReady(true);
      setPrepareMessage(
        omitted.length
          ? `The PDF is missing the photo for challenge ${omitted.join(", ")}. That photo is still saved in this browser. Nothing was erased.`
          : "",
      );
    })().catch(() => {
      if (!cancel) {
        setPdfReady(false);
        setPrepareMessage("This phone could not prepare the PDF. Your stamps, notes, and photos are still in this browser. Nothing was erased.");
      }
    });
    return () => {
      cancel = true;
      created.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [state]);

  async function onSavePdf() {
    if (!pdfBytes || !state) return;
    setSaveMessage("");
    const filename = certificateFilename(state.hunt.familyName);
    const file = new File([copyBytes(pdfBytes)], filename, { type: "application/pdf" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Family memory certificate" });
        setSaveMessage("The PDF is ready where you chose to save it. Your stamps, notes, and photos are still in this browser.");
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setSaveMessage("The PDF was not saved. Your stamps, notes, and photos are still in this browser.");
        return;
      }
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    setSaveMessage("The PDF file is downloading. Your stamps, notes, and photos are still in this browser.");
  }

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
          return urls[index];
        }}
        pdfReady={pdfReady}
        prepareMessage={prepareMessage}
        saveMessage={saveMessage}
        onSavePdf={() => void onSavePdf()}
      />
    </Frame>
  );
}
