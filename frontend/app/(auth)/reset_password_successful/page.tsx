"use client";

import { type ReactNode, useEffect, useState } from "react";
import Wrapper from "@/components/auth/Wrapper";
import Headline from "@/components/Headline";
import Image from "next/image";
import AuthFooter from "@/components/auth/footer/AuthFooter";
import { useRouter } from "next/navigation";
import Logo from "@/components/shared/Logo";

export default function ResetPasswordSuccessful(): ReactNode {
    const router = useRouter();

    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const successful = sessionStorage.getItem("passwordResetSuccessful");

        if (successful !== "true") {
            router.replace("/forgot_password");
            return;
        }

        setIsChecking(false);
    }, [router]);

    if (isChecking) {
        return (
            <Wrapper>
                <div className="flex min-h-75 flex-col items-center justify-center">
                    <Logo styles="" />

                    <p className="font-inter text-gray-500">Checking...</p>
                </div>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <Headline
                title="Password Changed"
                subTitle="Your password has been changed successfully"
            />

            <Image
                src="/auth/reset_successful.svg"
                alt="Icon showing the reset password is successful"
                width={96}
                height={98}
                className="mx-auto mt-10"
            />

            <button
                onClick={() => {
                    sessionStorage.removeItem("passwordResetSuccessful");

                    sessionStorage.removeItem("resetEmail");

                    router.push("/login");
                }}
                className="mt-7.5 w-full cursor-pointer rounded-[12px] bg-[#0037B1] py-4 font-inter text-white transition-colors duration-300 hover:bg-[#0037B1]/90"
            >
                Back to Login
            </button>

            <AuthFooter text="" button="" href="" />
        </Wrapper>
    );
}
