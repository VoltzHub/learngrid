import { type ReactNode } from 'react';
import Headline from '@/components/select_role/Headline';
import VerifyEmailCode from '@/components/auth/signup/verify_email/VerifyEmailCode';
import Button from '@/components/auth/Button';
import AuthFooter from '@/components/auth/footer/AuthFooter';
import Wrapper from '@/components/auth/Wrapper';

export default function VerifyEmail(): ReactNode {
    return (
        <Wrapper>
            <Headline
                title="Verify your email"
                subTitle="We just sent 6-digit code to sarah.jansen@gmail.com, enter it bellow:"
            />
            <VerifyEmailCode />
            <Button text="Verify Email" href="/verification_successful" />
            <AuthFooter text='Wrong email?' href='/signup' button='Send to different email' />
        </Wrapper>
    );
}