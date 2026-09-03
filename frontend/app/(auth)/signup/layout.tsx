import { type ReactNode } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create an Account | LearnGrid",
    description:
        "Create your LearnGrid account and start your learning journey. Join LearnGrid to discover online courses, attend classes, build new skills, and learn at your own pace.",
    keywords: [
        "LearnGrid signup",
        "LearnGrid registration",
        "create LearnGrid account",
        "online learning",
        "online courses",
        "online classes",
        "e-learning",
        "skill development",
        "online education",
        "learning platform",
        "courses in Nigeria",
    ],
    authors: [{ name: "LearnGrid" }],
    openGraph: {
        title: "Create an Account | LearnGrid",
        description:
            "Join LearnGrid and start learning. Create your account to discover courses, attend online classes, and build valuable skills.",
        siteName: "LearnGrid",
        type: "website",
        locale: "en_NG",
        images: [
            {
                url: "/auth/signup_image.png",
                width: 1200,
                height: 630,
                alt: "LearnGrid — SignUp",
            },
        ],
    },
};

export default function Layout({ children }: { children: React.ReactNode }): ReactNode{
    
    
    return (
            <div>
                {children}
            </div>
    );
}