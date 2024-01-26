import { AuthorUpdate } from '@/components/content-models/AuthorUpdate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import connectToDb from '@/lib/mongodb';
import Author from '@/models/Author';
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
    const data = await Author.findById(params.id);
    return (
        <DashboardWrapper>
            <AuthorUpdate
                id={params.id}
                data={JSON.parse(JSON.stringify(data))}
                LOCAL_STORAGE_KEY={`author_${params.id}`}
            />
            <Toaster />
        </DashboardWrapper>
    );
}
