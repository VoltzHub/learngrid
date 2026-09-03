"use client";

import { type ReactNode } from "react";
import Headline from "@/components/select_role/Headline";
import VerifyEmailCode from "@/components/auth/signup/verify_email/VerifyEmailCode";
import Button from "@/components/auth/Button";
import AuthFooter from "@/components/auth/footer/AuthFooter";
import Wrapper from "@/components/auth/Wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpOTPSchema, SignUpOTPSchemaType } from "@/schema/signUpOTPSchema";
import { useRouter } from "next/navigation";

function Page(): ReactNode {
    const form = useForm<SignUpOTPSchemaType>({
        resolver: zodResolver(signUpOTPSchema),
        mode: "onChange",
        defaultValues: {
            otpCode: "",
        },
    });

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

            <AuthFooter
                text="Wrong email?"
                href="/signup"
                button="Send to different email"
            />
        </Wrapper>
    );
}

export default Page;
