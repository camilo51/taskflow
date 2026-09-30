import type { Metadata, ReactNode } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "TaskFlow project management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
