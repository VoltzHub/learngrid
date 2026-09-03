import { type ReactNode } from 'react';
import './globals.css';
import { Inter } from "next/font/google";
import "./globals.css";
import { type Metadata } from 'next';

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "LearnGrid — Learn, Grow, and Build Your Future",
    description:
        "LearnGrid is an online learning platform where students can discover courses, attend online classes, develop valuable skills, and learn from anywhere.",
    keywords: [
        "LearnGrid",
        "online learning",
        "online courses",
        "online classes",
        "e-learning",
        "education platform",
        "learn online",
        "professional courses",
        "skill development",
        "digital learning",
        "educational platform",
        "courses in Nigeria",
        "online education Nigeria",
        "learning platform Nigeria",
        "student learning",
    ],
    authors: [{ name: "LearnGrid" }],
    creator: "LearnGrid",
    publisher: "LearnGrid",

    openGraph: {
        title: "LearnGrid — Learn, Grow, and Build Your Future",
        description:
            "Discover online courses, attend engaging classes, build practical skills, and take the next step in your learning journey with LearnGrid.",
        siteName: "LearnGrid",
        type: "website",
        locale: "en_NG",
        images: [
            {
                url: "/hero/hero_section.png",
                width: 1200,
                height: 630,
                alt: "LearnGrid — Online Learning Platform",
            },
        ],
    },

    icons: {
        icon: "/logo.png",
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={inter.variable}>
            <body>{children}</body>
        </html>
    );
}

