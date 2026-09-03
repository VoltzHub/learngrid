"use client"

import { type ReactNode, useState } from 'react';
import AuthSlider from '@/components/auth/AuthSlider';

export default function Layout(
    {
        children
    } : {
        children: ReactNode
    }
): ReactNode {
    const [showAuthSlider, setShowAuthSlider] = useState<boolean>(true);
    return (
        <main className="max-w-360 mx-auto flex h-full">
            {
                showAuthSlider && (
                    <section className="relative block xl:hidden h-screen w-screen max-w-300 min-h-50 max-h-400">
                        <AuthSlider handleAuthSlider={() => setShowAuthSlider(false)}/>
                    </section>

                )
            }
            <section className="hidden xl:block flex-1/2">
                {
                    showAuthSlider && (
                        <AuthSlider handleAuthSlider={() =>setShowAuthSlider(true)}/>
                    )
                }
            </section>
            <section className="hidden xl:block flex-1/2">{children}</section>
        </main>
    );
}