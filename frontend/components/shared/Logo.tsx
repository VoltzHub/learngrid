import { type ReactNode } from 'react';

import Link from 'next/link';

import Image from 'next/image';

export default function Logo({styles}: {styles: string}): ReactNode {
    return (
        <header className={`w-min h-min ${styles}`}>
            <Link
                href="/"
                style={{ textDecoration: "none" }}
                className="flex gap-x-2 justify-center items-center h-max w-max"
            >
                <Image
                    src="/logo.png"
                    alt="Logo of Learngrid"
                    width={40}
                    height={40}
                />
                <span className="font-inter font-bold text-[24px] tracking-[-0.5px] text-[#1F2937]">
                    LearnGrid
                </span>
            </Link>
        </header>
    );
}