"use client"

import { type ReactNode } from "react";
import Image from "next/image";
import Headline from "@/components/select_role/Headline";
import Wrapper from "@/components/auth/Wrapper";
import Button from "@/components/auth/Button";
import AuthFooter from "@/components/auth/footer/AuthFooter";
import { useRouter } from 'next/navigation';

export default function VerificationSuccessful(): ReactNode {

    const router = useRouter();

    return (
        <Wrapper>
            <Image
                src="/auth/successful_verification_icon.svg"
                alt="Tick Icon showing email is verified"
                width={88}
                height={88}
                className="mb-14.5 mx-auto"
            />
            <Headline
                title="Your account was successfully created!"
                subTitle="Only one click to explore online courses"
            />
            <button
                className="cursor-pointer rounded-[12px] py-4 bg-[#0037B1] text-white
    w-full font-inter mt-7.5 hover:bg-[#0037B1]/90 transition-colors duration-300
    "
                onClick={() => router.push("/login")}
            >
                Log In
            </button>
            <AuthFooter button="" href="" text="" />
        </Wrapper>
    );
}
