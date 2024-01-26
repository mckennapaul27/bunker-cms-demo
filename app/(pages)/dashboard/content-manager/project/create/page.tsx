import { ProjectCreate } from '@/components/content-models/ProjectCreate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import { Toaster } from 'react-hot-toast';

export default async function ContentManagerPage({}) {
    return (
        <DashboardWrapper>
            <ProjectCreate LOCAL_STORAGE_KEY="blog_content" />
            <Toaster />
        </DashboardWrapper>
    );
}
