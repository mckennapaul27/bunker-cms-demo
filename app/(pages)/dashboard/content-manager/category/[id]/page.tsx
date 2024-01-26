import { CategoryUpdate } from '@/components/content-models/CategoryUpdate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import connectToDb from '@/lib/mongodb';
import Category from '@/models/Category';
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
    const data = await Category.findById(params.id);
    return (
        <DashboardWrapper>
            <CategoryUpdate
                id={params.id}
                data={JSON.parse(JSON.stringify(data))}
            />
            <Toaster />
        </DashboardWrapper>
    );
}
