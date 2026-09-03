"use client"

import { type ReactNode } from 'react';
import Headline from '@/components/select_role/Headline';
import VerifyEmailCode from '@/components/auth/signup/verify_email/VerifyEmailCode';
import Button from '@/components/auth/Button';
import AuthFooter from '@/components/auth/footer/AuthFooter';
import Wrapper from '@/components/auth/Wrapper';
import VerifyResetCode from '@/components/auth/reset_password/VerifyResetCode';
import { resetOTPSchema, ResetOTPSchemaType } from '@/schema/resetOTPSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

function Page(): ReactNode {
    const form = useForm<ResetOTPSchemaType>({
        resolver: zodResolver(resetOTPSchema),
        mode: "onChange",
        defaultValues: {
            otpCode: "",
        },
    });

    const router = useRouter();

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

            <AuthFooter
                text=""
                href="/signup"
                button=""
            />
        </Wrapper>
    );
}

export default Page;


