import { type ReactNode } from 'react';

export default function Wrapper(
    {
        children
    } : {
        children: ReactNode
    }
): ReactNode {
    return (
        <div className='pb-8.5 pt-24 px-25 relative'>
            {children}
        </div>
    )
}