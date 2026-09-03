"use client";

import { type ReactNode, useState, useEffect } from "react";
import Headline from "@/components/select_role/Headline";
import VerifyEmailCode from "@/components/auth/signup/verify_email/VerifyEmailCode";
import Button from "@/components/auth/Button";
import AuthFooter from "@/components/auth/footer/AuthFooter";
import Wrapper from "@/components/auth/Wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpOTPSchema, SignUpOTPSchemaType } from "@/schema/signUpOTPSchema";
import { useRouter } from "next/navigation";
import axios from 'axios';

function Page(): ReactNode {
    const form = useForm<SignUpOTPSchemaType>({
        resolver: zodResolver(signUpOTPSchema),
        mode: "onChange",
        defaultValues: {
            otpCode: "",
        },
    });

     const [seconds, setSeconds] = useState(60);
        const [isResending, setIsResending] = useState(false);
    
        // Countdown
        useEffect(() => {
            if (seconds <= 0) return;
    
            const timer = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
    
            return () => clearInterval(timer);
        }, [seconds]);
    
        const handleResend = async () => {
            if (seconds > 0 || isResending) return;
    
            try {
                setIsResending(true);
    
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/verify_email`,
                    {
                        email: "sarah.jansen@gmail.com",
                    },
                );
    
                // Restart countdown
                setSeconds(60);
    
                // Clear the previous OTP
                form.reset({
                    otpCode: "",
                });
            } catch (error) {
                console.error("Failed to resend code:", error);
            } finally {
                setIsResending(false);
            }
        };
    
    const router = useRouter();

    const onSubmit = (data: SignUpOTPSchemaType) => {
        console.log(data);
        router.push("/verification_successful");
    };

    return (
        <Wrapper>
            <Headline
                title="Verify your email"
                subTitle="We just sent 6-digit code to sarah.jansen@gmail.com, enter it below:"
            />

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VerifyEmailCode form={form} />

                <Button
                    text="Verify Email"
                    disabled={!form.formState.isValid}
                />
            </form>

            {/* Resend section */}
            <div className="mt-6 text-center font-inter text-sm">
                {seconds > 0 ? (
                    <p className="text-gray-500">
                        Resend code in{" "}
                        <span className="font-semibold">{seconds}s</span>
                    </p>
                ) : (
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="font-semibold text-blue-500 hover:underline disabled:opacity-50"
                    >
                        {isResending ? "Sending..." : "Resend code"}
                    </button>
                )}
            </div>

            <AuthFooter
                text="Wrong email?"
                href="/signup"
                button="Send to different email"
            />
        </Wrapper>
    );
}

export default Page;
