import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Shell } from "@/components/shell";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://appuccinohub.github.io/magic-kingdom-family-hunt").replace(/\/$/, "");
const description =
  "A cooperative family bingo card and adventure passport for one phone. Big text. No timer. Not an official Disney app.";
const imageAlt = "Magic Kingdom family bingo. A purple card with gold letters and original star stamps.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Magic Kingdom family bingo",
  description,
  robots: { index: false, follow: false },
  openGraph: {
    title: "Magic Kingdom family bingo",
    description,
    url: siteUrl,
    siteName: "Magic Kingdom family bingo",
    type: "website",
    images: [{ url: `${siteUrl}/og.jpg`, width: 1200, height: 630, alt: imageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Magic Kingdom family bingo",
    description,
    images: [{ url: `${siteUrl}/og.jpg`, width: 1200, height: 630, alt: imageAlt }],
  },
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
