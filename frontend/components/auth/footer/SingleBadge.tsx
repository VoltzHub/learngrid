import { type ReactNode } from 'react';
import Image from 'next/image';

type SingleBadgeType = {
    title: string;
    icon: string;
}

export default function SingleBadge({title, icon}: SingleBadgeType): ReactNode {
    return (
        <article className='*:font-inter flex flex-col items-center justify-center gap-6
            *:text-[11px] *:text-[#434655]
        '>
            <Image src={icon} alt={`Icon displaying ${title}`} height={40} width={40}/>
            <small>{title}</small>
        </article>
    )
}