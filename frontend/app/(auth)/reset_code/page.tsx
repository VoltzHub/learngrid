"use client";

import { type ReactNode, useEffect, useState } from "react";
import Headline from "@/components/select_role/Headline";
import VerifyResetCode from "@/components/auth/reset_password/VerifyResetCode";
import Button from "@/components/auth/Button";
import AuthFooter from "@/components/auth/footer/AuthFooter";
import Wrapper from "@/components/auth/Wrapper";
import { resetOTPSchema, ResetOTPSchemaType } from "@/schema/resetOTPSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

function Page(): ReactNode {
    const form = useForm<ResetOTPSchemaType>({
        resolver: zodResolver(resetOTPSchema),
        mode: "onChange",
        defaultValues: {
            otpCode: "",
        },
    });

    const router = useRouter();

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
                `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`,
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

    const onSubmit = (data: ResetOTPSchemaType) => {
        console.log(data);
        router.push("/reset_password_successful");
    };

    return (
        <Wrapper>
            <Headline
                title="Please check your email"
                subTitle="We just sent 4-digit code to sarah.jansen@gmail.com, enter it below:"
            />

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VerifyResetCode form={form} />

                <Button text="Verify" disabled={!form.formState.isValid} />
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

            <AuthFooter text="" href="/signup" button="" />
        </Wrapper>
    );
}

export default Page;
