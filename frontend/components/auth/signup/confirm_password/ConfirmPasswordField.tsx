"use client";

import {
    signUpFormSchema,
    SignUpFormSchemaType,
} from "@/schema/signUpFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import InputContainer from "../../InputContainer";
import { Lock } from "lucide-react";
import Input from "../../Input";
import Label from "../../Label";
import { Eye, EyeClosed } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

export default function ConfirmPasswordField({
    form,
}: {
    form: UseFormReturn<SignUpFormSchemaType>;
}): ReactNode {
    
    const passwordConfirm = form.watch("passwordConfirm");

    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    return (
        <div className="font-inter my-7.5">
            <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="passwordConfirm" text="Confirm Password" />
            </div>

            <InputContainer
                styles={`
                    gap-x-2 relative
                    ${
                        passwordConfirm.length === 0
                            ? "border border-[#C4C5D7]"
                            : form.formState.errors.passwordConfirm
                              ? "border-2 border-red-500"
                              : "border-2 border-green-500"
                    }
                `}
            >
                <Lock className="relative z-50" />
                {showPassword && (
                    <Eye
                        className="absolute right-4 stroke-[#4C4A53]"
                        onClick={() => setShowPassword(!showPassword)}
                    />
                )}
                {!showPassword && (
                    <EyeClosed
                        className="absolute right-4 stroke-[#4C4A53]"
                        onClick={() => setShowPassword(!showPassword)}
                    />
                )}
                <Input
                    hook={form.register("passwordConfirm")}
                    id="passwordConfirm"
                    placeholder="........"
                    type="password"
                    styles="placholder:font-inter placeholder:text-5xl"
                />
            </InputContainer>
            {form.formState.errors.passwordConfirm?.message && (
                <small className="text-red-500 text-[16px] font-inter">
                    {form.formState.errors.passwordConfirm.message}
                </small>
            )}
        </div>
    );
}
