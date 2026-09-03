"use client";

import { type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    signUpFormSchema,
    SignUpFormSchemaType,
} from "@/schema/signUpFormSchema";

import Headline from "@/components/Headline";
import PasswordField from "@/components/auth/signup/password/PassWordField";
import EmailField from "@/components/auth/signup/email/EmailField";
import ConfirmPasswordField from "@/components/auth/signup/confirm_password/ConfirmPasswordField";
import Button from "@/components/auth/Button";
import AuthChoice from "@/components/auth/AuthChoice";
import GoogleButton from "@/components/auth/GoogleButton";
import AuthFooter from "@/components/auth/footer/AuthFooter";
import Wrapper from "@/components/auth/Wrapper";
import { useRouter } from "next/navigation";
import axios from 'axios';
import api from "@/lib/axios";

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

  const onSubmit = async (data: SignUpFormSchemaType) => {
      try {
          const response = await api.post(
              `/api/register`,
              {
                  email: data.email,
                  password: data.password,
                  password_confirmation: data.passwordConfirm,
              },
          );

          console.log(response.data);

          sessionStorage.setItem("verificationEmail", data.email);

          router.push("/verify_email");
      } catch (error) {
          if (axios.isAxiosError(error)) {
              console.log(error.response?.data);
          } else {
              console.log(error);
          }
      }
  };
    return (
        <Wrapper>
            <Headline title="Sign Up" subTitle="Start your learning journey" />

            <form onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-125 mx-auto"
            >
                <EmailField form={form} />
                <PasswordField form={form} />
                <ConfirmPasswordField form={form} />
                <Button
                    text="Sign Up"
                    disabled={!form.formState.isValid}
                />
                <AuthChoice />
                <GoogleButton />
            </form>


            <AuthFooter
                text="Already have an Account?"
                button="Log In"
                href="/login"
            />
        </Wrapper>
    );
}

export default Page;