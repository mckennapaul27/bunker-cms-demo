'use client';
import { SignUpForm } from '@/components/hook-form-elements/SignUpForm';
import { FullPageLoader } from '@/components/loading/FullPageLoader';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// uncomment this to use this page and create an account
export default function Page() {
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    useEffect(() => {
        if (sessionStatus === 'authenticated') router.push('/dashboard');
    }, [sessionStatus, router]);

    if (sessionStatus === 'loading') return <FullPageLoader />;
    if (sessionStatus !== 'authenticated') {
        return <SignUpForm />;
    }
}

// export default function Page() {
//     useEffect(() => {
//         redirect('/login');
//     }, []);
//     return <div></div>;
// }
