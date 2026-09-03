"use client";

import { type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    signUpFormSchema,
    SignUpFormSchemaType,
} from "@/schema/signUpFormSchema";

import Headline from "@/components/select_role/Headline";
import PasswordField from "@/components/auth/signup/password/PassWordField";
import EmailField from "@/components/auth/signup/email/EmailField";
import ConfirmPasswordField from "@/components/auth/signup/confirm_password/ConfirmPasswordField";
import Button from "@/components/auth/Button";
import AuthChoice from "@/components/auth/AuthChoice";
import GoogleButton from "@/components/auth/GoogleButton";
import AuthFooter from "@/components/auth/footer/AuthFooter";
import Wrapper from "@/components/auth/Wrapper";
import { useRouter } from "next/navigation";

function Page(): ReactNode {
   const form = useForm<SignUpFormSchemaType>({
       resolver: zodResolver(signUpFormSchema),
       mode: 'onChange',
       defaultValues: {
           email: "",
           password: "",
           passwordConfirm: "",
       },
   });

   const router = useRouter();

   const onSubmit = (data: SignUpFormSchemaType) => {
       console.log(data);

       router.push("/verify_email");
   };
    return (
        <Wrapper>
            <Headline title="Sign Up" subTitle="Start your learning journey" />

            <form onSubmit={form.handleSubmit(onSubmit)}>
                <EmailField form={form} />
                <PasswordField form={form} />
                <ConfirmPasswordField form={form} />
                <Button
                    text="Sign Up"
                    disabled={!form.formState.isValid}
                />
            </form>

            <AuthChoice />
            <GoogleButton />

            <AuthFooter
                text="Already have an Account?"
                button="Log In"
                href="/login"
            />
        </Wrapper>
    );
}

export default Page;