import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Weak from "@/components/auth/signup/password/WeakPassword";
import Medium from "@/components/auth/signup/password/MediumPassword";
import Strong from "@/components/auth/signup/password/StrongPassword";
import { type ReactNode } from "react";
import None from "@/components/auth/signup/password/NoPassword";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const isValidEmail = async (email: string) => {
    try {
        const isDisposableResponse = await fetch(
            `https://open.kickbox.com/v1/disposable/${email}`,
        );
        const isDisposable = await isDisposableResponse.json();
        if (isDisposable?.disposable) {
            return false;
        }

        return true;
    } catch {
        return true;
    }
};

export function testPassword(password: string) {
    const hasAlpha = /[A-Z]/.test(password);
    const hasNumber = /[\d]/.test(password);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);
    const passwordStrength = [hasAlpha, hasNumber, hasSpecialCharacter].filter(
        Boolean,
    ).length;

    if (password.length === 0) return 'none';
    if (password.length > 10 && passwordStrength > 2) return "strong";
    if (password.length > 8 && passwordStrength > 1) return "medium";
    return "weak";
}

export function testPasswordInfo(password: string) {
    const eightCharacters = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password);

    return {
        eightCharacters,
        hasNumber,
        hasSpecialCharacter,
    };
}

export function PasswordStrength(password: string): ReactNode {
    switch (password) {
        case "none":
            return <None />
        case "weak":
            return <Weak />
        case "medium":
            return <Medium />
        case "strong":
            return <Strong />
        default:
            return <></>;
    }
}
