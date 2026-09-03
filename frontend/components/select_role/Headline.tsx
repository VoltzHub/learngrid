import { type ReactNode } from 'react';

type headlineType = {
    title: string;
    subTitle: string;
}

export default function Headline({title, subTitle}: headlineType): ReactNode {

    return (
        <hgroup className='*:font-inter flex flex-col items-center gap-y-[14.9px]'>
            <h1 className="text-[30px] text-center text-[#121C2A] sm:text-[48px] font-bold tracking-[-0.96px] sm:leading-[57.6px]">{title}</h1>
            <p className='text-[#434655] text-[16px] sm:text-[18px] font-normal max-w-[619.22px] text-center'>{subTitle}</p>
        </hgroup>
    );
}