import { type ReactNode } from 'react';
import Headline from '@/components/select_role/Headline';
import Wrapper from '@/components/auth/Wrapper';
import EmailField from '@/components/auth/signup/email/EmailField';
import Button from '@/components/auth/Button';
import AuthFooter from '@/components/auth/footer/AuthFooter';

export default function ResetPassword(): ReactNode {
    return (
        <Wrapper>
            <Headline
                title="Reset password"
                subTitle="We will email you a link to reset your password."
            />
            <EmailField />
            <Button text='Send' href='/reset_password_successful'/>
            <AuthFooter href='' button='' text=''/>
        </Wrapper>
    );
}