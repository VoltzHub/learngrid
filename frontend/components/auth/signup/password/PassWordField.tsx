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

function PasswordField({
    form,
}: {
    form: UseFormReturn<SignUpFormSchemaType>;
}): ReactNode {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const password = form.watch("password");

    const showInfo = password.length > 0;

    const strengthOfPassword = testPassword(password);

    const strength = PasswordStrength(strengthOfPassword);

    const passwordInfo = testPasswordInfo(password);

    const requirements = [
        {
            id: 1,
            test: passwordInfo.eightCharacters,
            string: "8 characters minimum",
        },
        {
            id: 2,
            test: passwordInfo.hasNumber,
            string: "a number",
        },
        {
            id: 3,
            test: passwordInfo.hasSpecialCharacter,
            string: "a symbol",
        },
    ];

    return (
        <div className="font-inter my-7.5">
            <div className="mb-2">
                <Label htmlFor="password" text="Password" />
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
            <div className="mt-2">{strength}</div>
            {showInfo && (
                <div className="mt-2">
                    <div className="flex gap-2 flex-col relative">
                        {requirements.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className="relative flex items-center gap-2"
                                >
                                    <div className="relative size-4 rounded-full border border-[#9D9AA4]">
                                        {item.test && (
                                            <Image
                                                src="/auth/check.svg"
                                                alt="check icon"
                                                width={12}
                                                height={12}
                                                className="absolute inset-0 z-50 h-full w-full"
                                            />
                                        )}
                                    </div>

                                    <small className="text-[16px]">
                                        {item.string}
                                    </small>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PasswordField;
