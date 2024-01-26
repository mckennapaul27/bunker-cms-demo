import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import { FullPageLoader } from '@/components/loading/FullPageLoader';
import { FC } from 'react';

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
    return (
        <DashboardWrapper>
            <FullPageLoader />
        </DashboardWrapper>
    );
};

export default loading;
