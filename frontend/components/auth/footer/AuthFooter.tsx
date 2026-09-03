import { type ReactNode } from 'react';
import AlreadySignedUp from './AlreadySignedUp';
import { authFooterBadgesData } from '@/lib/data/auth/auth_footer_badges';
import SingleBadge from './SingleBadge';
import TermsAndConditions from './TermsAndConditions';

type AuthFooterProps = {
    text: string;
    button: string;
    href: string;
}

export default function AuthFooter({text, button, href}: AuthFooterProps): ReactNode {
  return (
        <footer>
            <AlreadySignedUp text={text} button={button} href={href}/>
            <section className='flex justify-between mx-auto w-3/4 mt-14.5'>
                {
                    authFooterBadgesData.map((item) => {
                        return (
                            <SingleBadge key={item.id} {...item} />
                        )
                    })
                }
            </section>
            <TermsAndConditions />
        </footer>
  )
}
