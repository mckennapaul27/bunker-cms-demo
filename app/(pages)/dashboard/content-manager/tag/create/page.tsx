import { TagCreate } from '@/components/content-models/TagCreate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import { Toaster } from 'react-hot-toast';

export default async function ContentManagerPage({}) {
    return (
        <DashboardWrapper>
            <TagCreate />
            <Toaster />
        </DashboardWrapper>
    );
}
