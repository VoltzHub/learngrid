import { type ReactNode } from 'react';
import Link from 'next/link';
import { type navLinksType } from '@/types/nav/nav_links';

export default function NavLink({textOrElement}: navLinksType): ReactNode {
    return (
        <li>
            <Link href='/' className='hover:underline transition-transform inline-block duration-300 hover:scale-105'>
                {textOrElement}
            </Link>
        </li>
    )
}  