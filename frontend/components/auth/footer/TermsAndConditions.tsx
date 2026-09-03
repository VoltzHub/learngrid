import { type ReactNode } from "react";
import Link from "next/link";

export default function TermsAndConditions(): ReactNode {
    return (
        <div className="*:font-inter font-inter *:text-[#747686] text-center mt-10">
            By signing in, you agree to our&nbsp;
            <Link href="/" className="text-[14px] text-[#0037B1]!">
                Terms of Service
            </Link>{" "}
            and&nbsp;
            <Link href="/" className="text-[#0037B1]! text-[14px]!">
                Privacy Policy.
            </Link>
        </div>
    );
}
