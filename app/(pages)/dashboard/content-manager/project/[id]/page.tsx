import { ProjectUpdate } from '@/components/content-models/ProjectUpdate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import connectToDb from '@/lib/mongodb';
import Project from '@/models/Project';
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
    const data = await Project.findById(params.id);
    // console.log(data);
    return (
        <DashboardWrapper>
            <ProjectUpdate
                id={params.id}
                data={JSON.parse(JSON.stringify(data))}
                LOCAL_STORAGE_KEY={`project_${params.id}`}
            />
            <Toaster />
        </DashboardWrapper>
    );
}
