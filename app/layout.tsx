import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Shell } from "@/components/shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Magic Kingdom family bingo",
  description:
    "A cooperative family bingo card and adventure passport for Magic Kingdom. Big text. No timer. Not an official Disney app.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff8ef",
};

const readingScript = `
try {
  var t = localStorage.getItem("mk-text");
  if (t === "xl" || t === "xxl" || t === "lg") document.documentElement.dataset.text = t;
  else document.documentElement.dataset.text = "lg";
  if (localStorage.getItem("mk-motion") === "reduce") document.documentElement.dataset.motion = "reduce";
} catch (e) {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-text="lg">
      <body>
        <Script id="reading-prefs" strategy="beforeInteractive">
          {readingScript}
        </Script>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
