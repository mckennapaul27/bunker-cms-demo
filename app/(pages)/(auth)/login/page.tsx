'use client';
import { LoginForm } from '@/components/hook-form-elements/LoginForm';
import { FullPageLoader } from '@/components/loading/FullPageLoader';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    useEffect(() => {
        if (sessionStatus === 'authenticated') router.push('/dashboard');
    }, [sessionStatus, router]);

    if (sessionStatus === 'loading') return <FullPageLoader />;
    if (sessionStatus !== 'authenticated') {
        return <LoginForm />;
    }
}
