"use client"

import { type ReactNode } from 'react'
import Headline from '@/components/select_role/Headline'
import PasswordField from '@/components/auth/login/password/PasswordField'
import EmailField from '@/components/auth/login/email/EmailField'
import RememberMe from '@/components/auth/remember_me/RememberMe'
import Button from '@/components/auth/Button'
import AuthChoice from '@/components/auth/AuthChoice'
import GoogleButton from '@/components/auth/GoogleButton'
import AuthFooter from '@/components/auth/footer/AuthFooter'
import Wrapper from '@/components/auth/Wrapper'
import { useRouter } from "next/navigation";
import { type LoginFormSchemaType, loginFormSchema } from '@/schema/loginFormSchema';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

function Page(): ReactNode {
   const form = useForm<LoginFormSchemaType>({
       resolver: zodResolver(loginFormSchema),
       mode: 'onChange',
       defaultValues: {
           email: "",
           password: "",
           rememberMe: false,
       },
   });

   const router = useRouter();

   const onSubmit = (data: LoginFormSchemaType) => {
       console.log(data);

       router.push("/select_role");
   };
  return (
    <Wrapper>
        <Headline title='Welcome Back' subTitle='Conutinue your learning journey'/>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <EmailField form={form} />
                <PasswordField form={form} />
                <Button
                    text="Sign In"
                    disabled={!form.formState.isValid}
                />
            </form>
        <AuthChoice />
        <GoogleButton />
        <AuthFooter text="Don't have an account?" button="Create Account" href='/signup' />
    </Wrapper>
  )
}

export default Page