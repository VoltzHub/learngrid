import { type ReactNode } from 'react';

import Logo from '@/components/shared/Logo';

import Link from 'next/link';

import { Button } from '../ui/button';

import { navLinksData } from '@/lib/data/nav/nav_links';

import NavLink from './NavLink';

export default function Nav(): ReactNode {
    
    return (
        <div className='w-screen max-w-360'>
            <header className='flex py-5 px-14 justify-between w-full'>
                <Logo styles='mx-0' />
                <nav className='*:font-inter *:text-[#1F2937] *:text-[16px] font-medium w-2/3'>
                    <ul className='flex items-center w-full justify-between'>
                        <li></li>
                        {navLinksData.map((navLinksItem) => {
                            return (
                                <NavLink key={navLinksItem.id} {...navLinksItem} />
                            )
                        })}
                    </ul>
                </nav>
            </header>
        </div>
    )
}