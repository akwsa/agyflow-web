import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

// Root layout stays language-neutral. Per-language metadata, JSON-LD and
// <html lang> (via post-build script) live in app/page.tsx, app/de/page.tsx
// and app/fr/page.tsx.
export const metadata: Metadata = {
  metadataBase: new URL("https://agyflow.com"),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-[100dvh] bg-neutral-void text-neutral-mist antialiased selection:bg-brand-mint selection:text-neutral-void font-sans">
        <Script
          defer
          data-domain="agyflow.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
