import type { Metadata } from "next";
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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;510;590&display=swap"
        />
      </head>
      <body className="min-h-screen bg-neutral-void text-neutral-mist antialiased selection:bg-brand-mint selection:text-neutral-void font-sans">
        {children}
      </body>
    </html>
  );
}
