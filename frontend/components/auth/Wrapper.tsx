import { type ReactNode } from 'react';
import Logo from '../shared/Logo';

export default function Wrapper(
    {
        children
    } : {
        children: ReactNode
    }
): ReactNode {
    return (
        <div className='pb-8.5 pt-24 lg:px-25 px-1 relative w-screen xl:w-max'>
            <Logo styles='mx-auto mb-4.5'/>
            {children}
        </div>
    )
}