import { BlogUpdate } from '@/components/content-models/BlogUpdate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import connectToDb from '@/lib/mongodb';
import Blog from '@/models/Blog';
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
    const data = await Blog.findById(params.id);
    // console.log(data);
    return (
        <DashboardWrapper>
            <BlogUpdate
                id={params.id}
                data={JSON.parse(JSON.stringify(data))}
                LOCAL_STORAGE_KEY={`blog_${params.id}`}
            />
            <Toaster />
        </DashboardWrapper>
    );
}
