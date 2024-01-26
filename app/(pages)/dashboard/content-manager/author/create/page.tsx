import { AuthorCreate } from '@/components/content-models/AuthorCreate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import { Toaster } from 'react-hot-toast';

export default async function ContentManagerPage({}) {
    return (
        <DashboardWrapper>
            <AuthorCreate LOCAL_STORAGE_KEY="author_content" />
            <Toaster />
        </DashboardWrapper>
    );
}
