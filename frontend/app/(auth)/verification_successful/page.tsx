import { type ReactNode } from "react";
import Image from "next/image";
import Headline from "@/components/select_role/Headline";
import Wrapper from "@/components/auth/Wrapper";
import Button from "@/components/auth/Button";
import AuthFooter from "@/components/auth/footer/AuthFooter";

export default function VerificationSuccessful(): ReactNode {
    return (
        <Wrapper>
            <Image
                src="/auth/successful_verification_icon.svg"
                alt="Tick Icon showing email is verified"
                width={88}
                height={88}
                className="mb-14.5 mx-auto"
            />
            <Headline title="Your account was successfully created!" subTitle="Only one click to explore online courses"/>
            <Button text="Log In" href='/login' />
            <AuthFooter button="" href="" text=""/>
        </Wrapper>
    );
}
