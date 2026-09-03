import { type ReactNode } from "react";

import Logo from "@/components/shared/Logo";

import Headline from "@/components/Headline";
import Roles from "@/components/select_role/Roles";

export default function SelectRole(): ReactNode {
    return (
        <main className="w-screen h-min py-36 max-w-360 flex flex-col items-center justify-center">
            <div className='flex flex-col gap-y-[14.9px] px-4'>
                <Logo styles="mx-auto"/>
                <Headline
                    title="How would you like to use the platform?"
                    subTitle="Choose the option that best describes you. Join our global community of
    experts and learners."
                />
            </div>
            <Roles />
        </main>
    );
}
