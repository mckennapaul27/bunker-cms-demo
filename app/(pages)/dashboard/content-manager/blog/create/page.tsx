import { BlogCreate } from '@/components/content-models/BlogCreate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import { Toaster } from 'react-hot-toast';

export default async function ContentManagerPage({}) {
    return (
        <DashboardWrapper>
            <BlogCreate LOCAL_STORAGE_KEY="blog_content" />
            <Toaster />
        </DashboardWrapper>
    );
}
