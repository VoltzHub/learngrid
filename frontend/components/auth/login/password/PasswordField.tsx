"use client";

import { type ReactNode, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    signUpFormSchema,
    SignUpFormSchemaType,
} from "@/schema/signUpFormSchema";
import { Eye, EyeClosed, Lock } from "lucide-react";
import Link from "next/link";
import Label from "../../Label";
import Input from "../../Input";
import InputContainer from "../../InputContainer";
import { testPassword } from "@/lib/utils";
import { PasswordStrength } from "@/lib/utils";
import Image from "next/image";
import { testPasswordInfo } from "@/lib/utils";
import type { UseFormReturn } from "react-hook-form";
import { LoginFormSchemaType } from "@/schema/loginFormSchema";

function PasswordField({
    form,
}: {
    form: UseFormReturn<LoginFormSchemaType>;
}): ReactNode {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const password = form.watch("password");

    return (
        <div className="font-inter my-7.5">
            <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="password" text="Password" />

                <Link
                    href="/reset_password"
                    className="text-[14px] leading-[19.6px] text-[#0037B1] font-medium"
                >
                    Forgot Password?
                </Link>
            </div>

            <InputContainer
                styles={`
                    gap-x-2 relative
                    ${
                        password.length === 0
                            ? "border border-[#C4C5D7]"
                            : form.formState.errors.password
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
                    hook={form.register("password")}
                    id="password"
                    placeholder="........"
                    type={showPassword ? "text" : "password"}
                    styles="placholder:font-inter placeholder:text-5xl"
                />
            </InputContainer>
            {form.formState.errors.password?.message && (
                <small className="text-red-500 text-[16px] font-inter">
                    {form.formState.errors.password.message}
                </small>
            )}
        </div>
    );
}

export default PasswordField;
