"use client";

import { type ReactNode } from "react";
import { SignUpFormSchemaType } from "@/schema/signUpFormSchema";
import { Mail } from "lucide-react";
import Label from "../../Label";
import Input from "../../Input";
import InputContainer from "../../InputContainer";
import { UseFormReturn } from "react-hook-form";

function EmailField({
    form,
}: {
    form: UseFormReturn<SignUpFormSchemaType>;
}): ReactNode {
    const email = form.watch("email");

    return (
        <div className="mt-16">
            <Label htmlFor="email" text="Email Address" />
            <InputContainer
                styles={`
                    gap-x-1
                    ${
                        email.length === 0
                            ? "border border-[#C4C5D7]"
                            : form.formState.errors.email
                            ? "border-2 border-red-500"
                            : "border-2 border-green-500"
                    }
                `}
            >
                <Mail className="relative z-50" />
                <Input
                    hook={form.register("email")}
                    id="email"
                    placeholder="name@company.com"
                    styles=""
                    type="email"
                />
            </InputContainer>
            {form.formState.errors.email?.message && (
                <small className="text-red-500 text-[14px] font-inter">
                    {form.formState.errors.email.message}
                </small>
            )}
        </div>
    );
}

export default EmailField;
