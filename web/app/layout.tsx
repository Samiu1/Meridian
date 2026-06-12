import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { cn } from "@/lib/utils";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Meridian",
  description: "An agent workspace for product managers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", plusJakartaSans.variable, lora.variable)}>
      <body>{children}</body>
    </html>
  );
}

