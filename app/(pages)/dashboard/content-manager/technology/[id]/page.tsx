import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import connectToDb from '@/lib/mongodb';
import { authOptions } from '@/utils/auth-helpers';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { TechnologyUpdate } from '@/components/content-models/TechnologyUpdate';
import Technology from '@/models/Technology';

export default async function ContentManagerPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);

    if (!session) return redirect('/login');
    await connectToDb();
    const data = await Technology.findById(params.id);
    return (
        <DashboardWrapper>
            <TechnologyUpdate
                id={params.id}
                data={JSON.parse(JSON.stringify(data))}
            />
            <Toaster />
        </DashboardWrapper>
    );
}
