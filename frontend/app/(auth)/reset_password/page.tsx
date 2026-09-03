"use client"

import { type ReactNode, useState, useEffect } from 'react';
import Headline from '@/components/select_role/Headline';
import Wrapper from '@/components/auth/Wrapper';
import EmailField from '@/components/auth/reset_password/EmailField';
import Button from '@/components/auth/Button';
import AuthFooter from '@/components/auth/footer/AuthFooter';
import { useRouter } from 'next/navigation';
import { resetEmailSchema, ResetEmailSchemaType } from '@/schema/resetEmailSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";
import api from "@/lib/axios";
import Logo from '@/components/shared/Logo';

export default function Page(): ReactNode {

    const [isSending, setIsSending] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        const storedEmail = sessionStorage.getItem("resetEmail");

        if (!storedEmail) {
            router.replace("/forgot_password");
            return;
        }

        setEmail(storedEmail);
        setIsChecking(false);
    }, [router]);

   const form = useForm<ResetEmailSchemaType>({
       resolver: zodResolver(resetEmailSchema),
       mode: 'onChange',
       defaultValues: {
           email: "",
       },
   });


   const onSubmit = async (data: ResetEmailSchemaType) => {
       if (isSending) {
           return;
       }

       try {
           setIsSending(true);

           await api.post("/api/forgot-password", {
               email: data.email,
           });

           sessionStorage.setItem("resetEmail", data.email);

           router.push("/reset_code");
       } catch (error) {
           if (axios.isAxiosError(error)) {
               console.log(error.response?.data);

               const message =
                   error.response?.data?.message ||
                   "Unable to send reset code.";

               form.setError("email", {
                   type: "server",
                   message,
               });
           } else {
               console.error(error);
           }
       } finally {
           setIsSending(false);
       }
   };
   if (isChecking) {
       return (
           <Wrapper>
               <div className="flex min-h-75 flex-col items-center justify-center">
                   <Logo styles="" />

                   <p className="font-inter text-gray-500">
                       Checking reset request...
                   </p>
               </div>
           </Wrapper>
       );
   }
    return (
        <Wrapper>
            <Headline
                title="Reset password"
                subTitle="We will email you a link to reset your password."
            />
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <EmailField form={form} />
                <Button
                    text={isSending ? "Sending..." : "Send"}
                    disabled={!form.formState.isValid || isSending}
                />
            </form>
            <AuthFooter href="" button="" text="" />
        </Wrapper>
    );
}