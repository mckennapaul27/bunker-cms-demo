import { PageCreate } from '@/components/content-models/PageCreate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import { Toaster } from 'react-hot-toast';

export default async function ContentManagerPage({}) {
    return (
        <DashboardWrapper>
            <PageCreate LOCAL_STORAGE_KEY="page_content" />
            <Toaster />
        </DashboardWrapper>
    );
}
