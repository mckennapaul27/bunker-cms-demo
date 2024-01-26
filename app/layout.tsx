import './global.scss';

import type { Metadata } from 'next';
import { Inter, Open_Sans } from 'next/font/google';
import classNames from 'classnames';
import SessionProvider from '@/lib/SessionProvider';

const openSans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Bunker CMS',
    description: 'Bunker CMS',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={classNames(openSans.className, 'primary-bg')}>
                <SessionProvider>
                    <div>{children}</div>
                </SessionProvider>
            </body>
        </html>
    );
}
