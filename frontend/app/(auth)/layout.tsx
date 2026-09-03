import { type ReactNode } from 'react';
import AuthSlider from '@/components/auth/AuthSlider';

export default function Layout(
    {
        children
    } : {
        children: ReactNode
    }
): ReactNode {
    return (
        <main className='max-w-360 mx-auto flex'>
            <section className='hidden lg:block flex-1/2'>
                <AuthSlider /> 
            </section>
            <section className='flex-1/2'>
                { children }
            </section>
        </main>
    )
}