import { type ReactNode } from 'react';
import AuthSlider from '@/components/auth/AuthSlider';

export default function Layout(
    {
        children
    } : {
        children: ReactNode
    }
): ReactNode {
    return (
        <main className="max-w-360 mx-auto flex h-full">
            <section className="relative block xl:hidden h-screen w-screen max-w-300 min-h-230 max-h-400">
                <AuthSlider />
            </section>
            <section className="hidden xl:block flex-1/2">
                <AuthSlider />
            </section>
            <section className="hidden xl:block flex-1/2">{children}</section>
        </main>
    );
}