import { type ReactNode } from 'react';
import Nav from '@/components/shared/Nav';
import Badges from '@/components/hero/Badges';

export default function Home(): ReactNode {
    return (
        <div className="bg-[url('/hero/hero_bg.png')] bg-cover w-screen h-screen">
            <Nav />
            <section>
                Hello Nextjs
                <Badges />
            </section>
        </div>
    )
}