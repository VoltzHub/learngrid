"use client";

import { type ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Headline from "@/components/select_role/Headline";
import Wrapper from "@/components/auth/Wrapper";
import AuthFooter from "@/components/auth/footer/AuthFooter";
import { useRouter } from "next/navigation";
import Logo from '@/components/shared/Logo';

export default function VerificationSuccessful(): ReactNode {
    const router = useRouter();

    const [isChecking, setIsChecking] = useState(true);

    const [isAuthorized, setIsAuthorized] = useState(false);


    useEffect(() => {
        const verificationSuccessful = sessionStorage.getItem(
            "verificationSuccessful",
        );

        if (verificationSuccessful !== "true") {
            router.replace("/signup");
            return;
        }
        setIsAuthorized(true);
        setIsChecking(false);
    }, [router]);

    if (isChecking) {
        return (
            <Wrapper>
                <div className="flex flex-col min-h-75 items-center justify-center">
                    <Logo styles=""/>
                    <p className="font-inter text-gray-500 mt-4">
                        Checking verification...
                    </p>
                </div>
            </Wrapper>
        );
    }

    if (!isAuthorized) {
        return (
            <Wrapper>
                <div className="flex flex-col min-h-75 items-center justify-center">
                    <Logo styles=""/>
                    <p className="font-inter text-gray-500">Redirecting...</p>
                </div>
            </Wrapper>
        );
    }

    const handleLogin = () => {
        sessionStorage.removeItem("verificationSuccessful");
        router.push("/login");
    };

    // Don't render the page until we've checked sessionStorage
    if (isChecking) {
        return null;
    }

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
                w-full font-inter mt-7.5 hover:bg-[#0037B1]/90
                transition-colors duration-300"
                onClick={handleLogin}
            >
                Log In
            </button>

            <AuthFooter button="" href="" text="" />
        </Wrapper>
    );
}
