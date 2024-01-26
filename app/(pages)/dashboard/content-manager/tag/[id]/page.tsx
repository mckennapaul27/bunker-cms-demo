import { TagUpdate } from '@/components/content-models/TagUpdate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import connectToDb from '@/lib/mongodb';
import { authOptions } from '@/utils/auth-helpers';
import Tag from '@/models/Tag';
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
    const data = await Tag.findById(params.id);
    return (
        <DashboardWrapper>
            <TagUpdate id={params.id} data={JSON.parse(JSON.stringify(data))} />
            <Toaster />
        </DashboardWrapper>
    );
}
