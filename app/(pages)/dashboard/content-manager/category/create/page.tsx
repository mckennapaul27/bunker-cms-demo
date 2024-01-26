import { CategoryCreate } from '@/components/content-models/CategoryCreate';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import { Toaster } from 'react-hot-toast';

export default async function ContentManagerPage({}) {
    return (
        <DashboardWrapper>
            <CategoryCreate />
            <Toaster />
        </DashboardWrapper>
    );
}
