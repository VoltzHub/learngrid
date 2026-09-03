import { type ReactNode } from 'react';
import Wrapper from '@/components/auth/Wrapper';
import Headline from '@/components/select_role/Headline';
import Image from 'next/image';
import AuthFooter from '@/components/auth/footer/AuthFooter';
import Button from '@/components/auth/Button';

export default function ResetPasswordSuccessful(): ReactNode {
    return (
        <Wrapper>
            <Headline title="Reset Password" subTitle="" />
            <Image
                src="/auth/reset_successful.svg"
                alt="Icon showing the reset password is successful"
                width={96}
                height={98}
                className='mx-auto'
            />
            <AuthFooter text="We have sent an email to sarah.jansen@gmail.com with instructions to reset your password." button='' href=''/>
            <Button text='Back to login' href='/login' />
        </Wrapper>
    );
}