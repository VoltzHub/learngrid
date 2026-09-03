"use client";

import { type ReactNode, useEffect, useState } from "react";
import Headline from "@/components/Headline";
import VerifyEmailCode from "@/components/auth/signup/verify_email/VerifyEmailCode";
import Button from "@/components/auth/Button";
import AuthFooter from "@/components/auth/footer/AuthFooter";
import Wrapper from "@/components/auth/Wrapper";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpOTPSchema, SignUpOTPSchemaType } from "@/schema/signUpOTPSchema";
import Logo from "@/components/shared/Logo";
import { useRouter } from "next/navigation";
import axios from "axios";

function Page(): ReactNode {
    const router = useRouter();

    const [email, setEmail] = useState<string | null>(null);
    const [seconds, setSeconds] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const form = useForm<SignUpOTPSchemaType>({
        resolver: zodResolver(signUpOTPSchema),
        mode: "onChange",
        defaultValues: {
            otpCode: "",
        },
    });

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("verificationEmail");

        if (!storedEmail) {
            router.replace("/signup");
            return;
        }

        setEmail(storedEmail);
        setIsChecking(false);
    }, [router]);

    // ...your other code...

    /*
     * Countdown for the resend button.
     */
    useEffect(() => {
        if (seconds <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setSeconds((previous) => previous - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);

    /*
     * Verify the OTP.
     */

  const onSubmit = async (data: SignUpOTPSchemaType) => {
      if (!email || isVerifying) {
          return;
      }

      try {
          setIsVerifying(true);

          const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/verify-email`,
              {
                  email: email,
                  code: data.otpCode,
              },
          );

          console.log(response.data);

          sessionStorage.setItem("verificationSuccessful", "true");
          sessionStorage.setItem("loginEmail", email);
          sessionStorage.removeItem("verificationEmail");

          router.push("/verification_successful");
      } catch (error) {
          if (axios.isAxiosError(error)) {
              console.log(error.response?.data);

              const message =
                  error.response?.data?.message ||
                  "Verification failed. Please try again.";

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

    /*
     * Resend the verification code.
     */
    const handleResend = async () => {
        if (!email || seconds > 0 || isResending) {
            return;
        }

        try {
            setIsResending(true);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/send-verification-code`,
                {
                    email: email,
                },
            );

            console.log(response.data);

            /*
             * Restart the countdown.
             */
            setSeconds(60);

            /*
             * Clear the old OTP.
             */
            form.reset({
                otpCode: "",
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data);
            } else {
                console.error(error);
            }
        } finally {
            setIsResending(false);
        }
    };

    /*
     * Don't render the verification form until
     * we know that an email exists.
     */
    if (isChecking) {
        return (
            <Wrapper>
                <div className="flex min-h-75 flex-col items-center justify-center">
                    <Logo styles="" />

                    <p className="font-inter text-gray-500 mt-4">
                        Checking verification...
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
                title="Verify your email"
                subTitle={`We just sent a 6-digit code to ${email}, enter it below:`}
            />

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-125 mx-auto"
            >
                <VerifyEmailCode form={form} />

                <Button
                    text={isVerifying ? "Verifying..." : "Verify Email"}
                    disabled={!form.formState.isValid || isVerifying}
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
