import { type ReactNode } from 'react';

import { type LucideIcon, ArrowRight } from 'lucide-react';

import Link from 'next/link';

import { selectRoleType } from '@/types/auth/select_role/select_role';

import { selectRoleTypeClick } from '@/types/auth/select_role/select_role';

import { cardStyle } from '@/types/auth/select_role/select_role';

export default function Card({id, image, track, trackIcon: Icon, role, roleDescription, handleClick, styles} : selectRoleType & selectRoleTypeClick & cardStyle): ReactNode {

    return (
        <article onClick={() => handleClick(id)} className={styles}>
            <section className="relative">
                <img
                    src={image}
                    alt={`A picture illustrating the ${track}`}
                    className="w-120.5 h-64 object-center object-cover rounded-t-[16px]"
                />
                <footer className="gap-x-2 absolute flex bottom-4 left-4">
                    <Icon className="transition-colors duration-500 group-hover:fill-[#86F9BD] group-hover:stroke-initial w-5.5 h-4.5" />
                    <p className="uppercase text-white font-inter font-bold tracking-[1.4px]">
                        {track}
                    </p>
                </footer>
            </section>
            <footer className="p-8 bg-white">
                <h2 className="transition-transform duration-500 group-hover:scale-105 origin-left font-inter font-semibold text-[24px] mb-3">
                    {role}
                </h2>
                <p className="pb-8 font-inter leading-6 text-[16px] text-[#434655]">
                    {roleDescription}
                </p>
                <Link
                    href="/"
                    className="hover:bg-[#EFF4FF]/60 bg-[#EFF4FF] p-4 rounded-[12px] flex justify-between items-center transition-colors duration-500"
                >
                    <small className="text-[14px] font-bold font-inter text-[#121C2A]">
                        Continue as {role}
                    </small>
                    <ArrowRight className="transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
            </footer>
        </article>
    );
}