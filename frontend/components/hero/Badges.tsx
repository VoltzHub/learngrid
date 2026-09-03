import { type ReactNode } from 'react';
import { badgeData } from '@/lib/data/hero/badge';
import BadgeComp from './BadgeComp';

export default function Badges(): ReactNode {
    return (
        <header className='flex gap-x-7.5'>
            {badgeData.map((badgeDataItem) => {
                return (
                    <BadgeComp key={badgeDataItem.id} {...badgeDataItem} />
                )
            })}
        </header>
    )
}