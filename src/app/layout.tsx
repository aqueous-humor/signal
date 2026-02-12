import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Signal",
  description: "Internal idea & feedback workspace for modern teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
