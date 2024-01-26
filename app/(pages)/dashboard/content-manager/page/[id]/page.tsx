import { PageUpdate } from '@/components/content-models/PageUpdate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import connectToDb from '@/lib/mongodb';
import Page from '@/models/Page';
import { authOptions } from '@/utils/auth-helpers';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default async function ContentManagerPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);

    if (!session) return redirect('/login');
    await connectToDb();
    const data = await Page.findById(params.id);
    return (
        <DashboardWrapper>
            <PageUpdate
                id={params.id}
                data={JSON.parse(JSON.stringify(data))}
                LOCAL_STORAGE_KEY={`blog_${params.id}`}
            />
            <Toaster />
        </DashboardWrapper>
    );
}
