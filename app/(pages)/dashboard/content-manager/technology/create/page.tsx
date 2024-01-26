import { TechnologyCreate } from '@/components/content-models/TechnologyCreate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import { Toaster } from 'react-hot-toast';

export default async function ContentManagerPage({}) {
    return (
        <DashboardWrapper>
            <TechnologyCreate />
            <Toaster />
        </DashboardWrapper>
    );
}
