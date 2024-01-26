import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import connectToDb from '@/lib/mongodb';
import { authOptions } from '@/utils/auth-helpers';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { SkillUpdate } from '@/components/content-models/SkillUpdate';
import Skill from '@/models/Skill';

export default async function ContentManagerPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);

    if (!session) return redirect('/login');
    await connectToDb();
    const data = await Skill.findById(params.id);
    return (
        <DashboardWrapper>
            <SkillUpdate
                id={params.id}
                data={JSON.parse(JSON.stringify(data))}
            />
            <Toaster />
        </DashboardWrapper>
    );
}
