"use client";

import { type ReactNode, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Eye, EyeClosed, Lock } from "lucide-react";
import { SignUpFormSchemaType } from "@/schema/signUpFormSchema";
import InputContainer from "../../InputContainer";
import Input from "../../Input";
import Label from "../../Label";

export default function ConfirmPasswordField({
    form,
}: {
    form: UseFormReturn<SignUpFormSchemaType>;
}): ReactNode {
    const [showPassword, setShowPassword] = useState(false);

    const passwordConfirm = form.watch("passwordConfirm") || "";

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

                {showPassword ? (
                    <Eye
                        className="absolute right-4 stroke-[#4C4A53] cursor-pointer"
                        onClick={() => setShowPassword(false)}
                    />
                ) : (
                    <EyeClosed
                        className="absolute right-4 stroke-[#4C4A53] cursor-pointer"
                        onClick={() => setShowPassword(true)}
                    />
                )}

                <Input
                    hook={form.register("passwordConfirm")}
                    id="passwordConfirm"
                    placeholder="........"
                    type={showPassword ? "text" : "password"}
                    styles="placeholder:font-inter placeholder:text-5xl"
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
