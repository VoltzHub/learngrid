"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import OtpInput from "@/components/auth/signup/verify_email/OtpInput";
import { Button } from "@/components/ui/button";
import { SignUpFormSchemaType, signUpFormSchema} from "@/schema/signUpFormSchema";


export default function VerifyEmailCode() {
    const [isVerifying, setIsVerifying] = useState(false);

    const router = useRouter();

    const form = useForm<SignUpFormSchemaType>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            otpCode: "",
        },
        mode: "onChange",
    });

    const handleComplete = async (code: string) => {
        form.setValue("otpCode", code, {
            shouldValidate: true,
            shouldDirty: true,
        });

        if (code.length !== 6) return;

        setIsVerifying(true);

        console.log("OTP:", code);

        // Verify OTP with your backend here

        setIsVerifying(false);
    };

    const onSubmit = (data: SignUpFormSchemaType) => {
        console.log(data);

        router.push("/verification_successful");
    };

    return (
        <main className="mt-10">
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <OtpInput length={6} onChange={handleComplete} />

                {form.formState.errors.otpCode && (
                    <p className="mt-2 text-center font-inter text-sm text-red-500">
                        {form.formState.errors.otpCode.message}
                    </p>
                )}
                {isVerifying && (
                    <p className="mt-2 text-center font-inter text-sm text-gray-500">
                        Verifying...
                    </p>
                )}
                <Button
                    type="submit"
                    disabled={!form.formState.isValid || isVerifying}
                    className="mx-auto mt-4 block font-inter"
                >
                    Verify
                </Button>
            </form>
            <Button
                variant="ghost"
                className="mx-auto mt-4 block font-inter"
                onClick={() => {
                    // Resend code
                }}
            >
                Resend code
            </Button>
        </main>
    );
}
