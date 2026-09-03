"use client"

import { type ReactNode, useState, useEffect } from 'react'
import Headline from '@/components/Headline'
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
import api from "@/lib/axios";
import axios from 'axios';

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

   const [isLoggingIn, setIsLoggingIn] = useState(false);

   useEffect(() => {
       const savedEmail = sessionStorage.getItem("loginEmail");

       if (savedEmail) {
           form.setValue("email", savedEmail);
       }
   }, [form]);
   const router = useRouter();

   const onSubmit = async (data: LoginFormSchemaType) => {
       if (isLoggingIn) {
           return;
       }

       try {
           setIsLoggingIn(true);

           // Get the CSRF cookie first
           await api.get("/sanctum/csrf-cookie");

           // Login
           const response = await api.post("/api/login", {
               email: data.email,
               password: data.password,
               rememberMe: data.rememberMe,
           });

           console.log(response.data);

           router.push("/select_role");
       } catch (error) {
           if (axios.isAxiosError(error)) {
               console.log(error.response?.data);

               const message =
                   error.response?.data?.message ||
                   "Login failed. Please check your email and password.";

               form.setError("email", {
                   type: "server",
                   message,
               });
           } else {
               console.error(error);
           }
       } finally {
           setIsLoggingIn(false);
       }
   };
  return (
      <Wrapper>
          <Headline
              title="Welcome Back"
              subTitle="Conutinue your learning journey"
          />
          <form onSubmit={form.handleSubmit(onSubmit)}>
              <EmailField form={form} />
              <PasswordField form={form} />
              <RememberMe hook={form.register("rememberMe")} />
              <Button
                  text={isLoggingIn ? "Signing In..." : "Sign In"}
                  disabled={!form.formState.isValid || isLoggingIn}
              />
                <AuthChoice />
                <GoogleButton />
          </form>
          <AuthFooter
              text="Don't have an account?"
              button="Create Account"
              href="/signup"
          />
      </Wrapper>
  );
}

export default Page