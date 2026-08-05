import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://learngrid-ten.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LearnGrid — Teach Live. Learn Live. Earn in Naira.",
    template: "%s · LearnGrid",
  },
  description:
    "LearnGrid helps verified Nigerian teachers host live classes and get paid securely in Naira while students learn in real time.",
  openGraph: {
    type: "website",
    siteName: "LearnGrid",
    locale: "en_NG",
    title: "LearnGrid — Teach Live. Learn Live. Earn in Naira.",
    description:
      "Nigeria's live learning marketplace. Verified teachers, secure Paystack payments, real-time classes.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnGrid — Teach Live. Learn Live. Earn in Naira.",
    description:
      "Nigeria's live learning marketplace. Verified teachers, secure Paystack payments, real-time classes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
