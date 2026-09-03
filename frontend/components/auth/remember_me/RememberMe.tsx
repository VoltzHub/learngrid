"use client"

import { signUpFormSchema, SignUpFormSchemaType } from '@/schema/signUpFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';


export default function RememberMe(): ReactNode {

    const form = useForm<SignUpFormSchemaType>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            rememberMe: false
        }
    })
    return (
        <div className='flex items-center gap-2 ml-1'>
            <input type="checkbox" id="remember_me" />
            <label
                htmlFor="remember_me"
                className="leading-6 text-[16px] align-middle font-inter text-[#434655]">
                Remember Me
            </label>
        </div>
    );
}