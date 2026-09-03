import { type ReactNode } from 'react';

export default function AuthChoice() {
    return (
        <div className="mt-10 flex w-full items-center gap-4">
            <div className="h-px flex-1 bg-[#C4C5D7]" />

            <span className="font-inter text-[14px] font-medium text-[#747686]">
                OR
            </span>

            <div className="h-px flex-1 bg-[#C4C5D7]" />
        </div>
    );
}
