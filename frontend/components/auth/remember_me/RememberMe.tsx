"use client";

import { type ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type InputProps = {
    hook: UseFormRegisterReturn;
};

export default function RememberMe({ hook }: InputProps): ReactNode {
    return (
        <div className="flex items-center gap-2 ml-1">
            <input {...hook} type="checkbox" id="remember_me" />
            <label
                htmlFor="remember_me"
                className="leading-6 text-[16px] align-middle font-inter text-[#434655]"
            >
                Remember Me
            </label>
        </div>
    );
}
