import { getServerSession } from 'next-auth';
import { DashboardSideBanner } from './DashboardSideBanner';
import styles from './DashboardWrapper.module.scss';
import { redirect } from 'next/navigation';
import { authOptions } from '@/utils/auth-helpers';

export const DashboardWrapper = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const session = await getServerSession(authOptions);
    if (!session) return redirect('/login');
    return (
        <div className={styles['wrapper']}>
            <div>
                <DashboardSideBanner />
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
};
