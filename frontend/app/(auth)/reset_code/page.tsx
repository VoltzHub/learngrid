"use client";

import { type ReactNode, useEffect, useState } from "react";
import Headline from "@/components/Headline";
import VerifyResetCode from "@/components/auth/reset_password/VerifyResetCode";
import Button from "@/components/auth/Button";
import AuthFooter from "@/components/auth/footer/AuthFooter";
import Wrapper from "@/components/auth/Wrapper";
import Logo from "@/components/shared/Logo";
import {
    resetOTPSchema,
    type ResetOTPSchemaType,
} from "@/schema/resetOTPSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/axios";

function Page(): ReactNode {
    const form = useForm<ResetOTPSchemaType>({
        resolver: zodResolver(resetOTPSchema),
        mode: "onChange",
        defaultValues: {
            otpCode: "",
        },
    });

    const router = useRouter();

    const [email, setEmail] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const [seconds, setSeconds] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // Check that the user actually requested a password reset
    useEffect(() => {
        const storedEmail = sessionStorage.getItem("resetEmail");

        if (!storedEmail) {
            router.replace("/forgot_password");
            return;
        }

        setEmail(storedEmail);
        setIsChecking(false);
    }, [router]);

    // Countdown
    useEffect(() => {
        if (seconds <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);

    const handleResend = async () => {
        if (seconds > 0 || isResending || !email) {
            return;
        }

        try {
            setIsResending(true);

            await api.post("/api/forgot-password", {
                email,
            });

            setSeconds(60);

            form.reset({
                otpCode: "",
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data);
            } else {
                console.error(error);
            }
        } finally {
            setIsResending(false);
        }
    };

    const onSubmit = async (data: ResetOTPSchemaType) => {
        if (!email || isVerifying) {
            return;
        }

        try {
            setIsVerifying(true);

            const response = await api.post("/api/verify-reset-code", {
                email,
                code: data.otpCode,
            });

            console.log(response.data);

            router.push("/reset_password");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    "Invalid or expired reset code.";

                form.setError("otpCode", {
                    type: "server",
                    message,
                });
            } else {
                console.error(error);
            }
        } finally {
            setIsVerifying(false);
        }
    };

    // Show loading while checking sessionStorage
    if (isChecking) {
        return (
            <Wrapper>
                <div className="flex min-h-75 flex-col items-center justify-center">
                    <Logo styles="" />

                    <p className="font-inter text-gray-500">
                        Checking reset request...
                    </p>
                </div>
            </Wrapper>
        );
    }

    if (!email) {
        return null;
    }

    return (
        <Wrapper>
            <Headline
                title="Please check your email"
                subTitle={`We just sent a 4-digit code to ${email}, enter it below:`}
            />

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <VerifyResetCode form={form} />

                <Button
                    text={isVerifying ? "Verifying..." : "Verify"}
                    disabled={!form.formState.isValid || isVerifying}
                />
            </form>

            <div className="mt-6 text-center font-inter text-sm">
                {seconds > 0 ? (
                    <p className="text-gray-500">
                        Resend code{" "}
                        <span className="font-semibold">in {seconds}s</span>
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
