import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeNex Admin | Guardian Command Center",
  description: "Advanced monitoring and management for the SafeNex safety platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
