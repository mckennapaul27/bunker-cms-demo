import { SkillCreate } from '@/components/content-models/SkillCreate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import { Toaster } from 'react-hot-toast';

export default async function ContentManagerPage({}) {
    return (
        <DashboardWrapper>
            <SkillCreate />
            <Toaster />
        </DashboardWrapper>
    );
}
