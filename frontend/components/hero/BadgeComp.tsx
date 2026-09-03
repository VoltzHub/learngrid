import { type ReactNode } from 'react';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { badgeType } from '@/types/hero/badge';

export default function BadgeComp({icon, text}: badgeType): ReactNode {
    return (
        <Badge className='bg-white w-min flex gap-y-1.5 py-3.5 px-5'>
            <Image src={icon} alt={`This is the image for ${text}`} width={20} height={20}/>
            <small className='text-[16px] tracking-[-0.5px] font-inter text-black'>{text}</small>
        </Badge>
    )
}