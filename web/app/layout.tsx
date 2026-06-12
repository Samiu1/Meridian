import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meridian",
  description: "An agent workspace for product managers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
