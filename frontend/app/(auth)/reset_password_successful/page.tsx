"use client"

import { type ReactNode } from 'react';
import Wrapper from '@/components/auth/Wrapper';
import Headline from '@/components/select_role/Headline';
import Image from 'next/image';
import AuthFooter from '@/components/auth/footer/AuthFooter';
import { useRouter } from 'next/navigation';


export default function ResetPasswordSuccessful(): ReactNode {

    const router = useRouter();

    return (
        <Wrapper>
            <Headline
                title="Password Changed"
                subTitle="Your password has been changed succesfully"
            />
            <Image
                src="/auth/reset_successful.svg"
                alt="Icon showing the reset password is successful"
                width={96}
                height={98}
                className="mx-auto mt-10"
            />
            <button
                onClick={() => router.push("/login")}
                className="cursor-pointer rounded-[12px] py-4 bg-[#0037B1] text-white
    w-full font-inter mt-7.5 hover:bg-[#0037B1]/90 transition-colors duration-300
    "
            >
                Back to Login
            </button>
            <AuthFooter text="" button="" href="" />
        </Wrapper>
    );
}