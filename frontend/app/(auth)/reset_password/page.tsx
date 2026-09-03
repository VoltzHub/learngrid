"use client"

import { type ReactNode } from 'react';
import Headline from '@/components/select_role/Headline';
import Wrapper from '@/components/auth/Wrapper';
import EmailField from '@/components/auth/reset_password/EmailField';
import Button from '@/components/auth/Button';
import AuthFooter from '@/components/auth/footer/AuthFooter';
import { useRouter } from 'next/navigation';
import { resetEmailSchema, ResetEmailSchemaType } from '@/schema/resetEmailSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Page(): ReactNode {
   const form = useForm<ResetEmailSchemaType>({
       resolver: zodResolver(resetEmailSchema),
       mode: 'onChange',
       defaultValues: {
           email: "",
       },
   });

   const router = useRouter();

   const onSubmit = (data: ResetEmailSchemaType) => {
       console.log(data);

       router.push("/reset_code");
   };

    return (
        <Wrapper>
            <Headline
                title="Reset password"
                subTitle="We will email you a link to reset your password."
            />
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <EmailField form={form}/>
                <Button text='Send' disabled={!form.formState.isValid} />
            </form>
            <AuthFooter href='' button='' text=''/>
        </Wrapper>
    );
}