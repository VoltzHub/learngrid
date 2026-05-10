import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "LearnGrid — Teach live. Learn live. Earn in Naira.",
  description:
    "LearnGrid helps verified Nigerian teachers host live classes and get paid securely in Naira while students learn in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
