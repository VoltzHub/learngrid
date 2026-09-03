"use client";

import { type ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import OtpInput from "@/components/auth/signup/verify_email/OtpInput";
import { SignUpOTPSchemaType } from "@/schema/signUpOTPSchema";
import { ResetOTPSchemaType } from "@/schema/resetOTPSchema";

type Props = {
    form: UseFormReturn<ResetOTPSchemaType>;
};

export default function VerifyResetCode({ form }: Props): ReactNode {
    const handleComplete = (code: string) => {
        form.setValue("otpCode", code, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    return (
        <div className="mt-10">
            <OtpInput length={4} onChange={handleComplete} />

            {form.formState.errors.otpCode && (
                <p className="mt-2 text-center font-inter text-sm text-red-500">
                    {form.formState.errors.otpCode.message}
                </p>
            )}
        </div>
    );
}
