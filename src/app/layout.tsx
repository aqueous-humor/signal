import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signal",
  // Standard meta tag for browsers
  other: {
    google: "notranslate",
    // This tells Google Search not to offer a translation in snippets
    googlebot: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
