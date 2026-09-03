import { type ReactNode } from 'react';
import Link from 'next/link';

type AlreadySignedUpProps = {
    text: string;
    button: string;
    href: string;
}

export default function AlreadySignedUp({text, button, href}: AlreadySignedUpProps): ReactNode {
    return (
        <div className='text-[#434655] font-inter leading-6 text-[16px] flex justify-center items-center
            mt-13
        '>
            {text}&nbsp;
            <Link
                href={href}
                className="font-semibold! font-inter leading-6 text-[16px] text-[#0037B1]!"
            >
                {button}
            </Link>
        </div>
    );
}