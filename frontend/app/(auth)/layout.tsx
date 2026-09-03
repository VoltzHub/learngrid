"use client";

import { type ReactNode, useState } from "react";
import AuthSlider from "@/components/auth/AuthSlider";

export default function Layout({
    children,
}: {
    children: ReactNode;
}): ReactNode {
    const [showAuthSlider, setShowAuthSlider] = useState(true);

    return (
        <main className="mx-auto flex min-h-screen max-w-360">
            {/* MOBILE */}
            {showAuthSlider && (
                <section className="relative block h-screen w-screen sm:hidden">
                    <AuthSlider
                        handleAuthSlider={() => setShowAuthSlider(false)}
                    />
                </section>
            )}

            {!showAuthSlider && (
                <section className="block w-full sm:hidden">{children}</section>
            )}

            {/* DESKTOP */}
            <section className="hidden min-h-screen flex-1 sm:block">
                <AuthSlider handleAuthSlider={() => {}} />
            </section>

            <section className="hidden min-h-screen flex-1 sm:block">
                {children}
            </section>
        </main>
    );
}
