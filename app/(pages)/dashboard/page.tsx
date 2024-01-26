import { StickyHeader } from '@/components/collections/StickyHeader';
import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import { collection_models } from '@/models/models';
import styles from '../../../styles/dashboard-general.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import { FilePlus } from 'lucide-react';

export default function Page({}) {
    return (
        <DashboardWrapper>
            <StickyHeader>
                <div className={'sticky-header__collection-details'}>
                    <h1>Dashboard home</h1>
                    <p>Manage your content</p>
                </div>
            </StickyHeader>
            <div className={styles['collections-boxes']}>
                {collection_models.map((model, i) => {
                    return (
                        <div
                            className={styles['collection-wrapper']}
                            key={`content-model-${i}`}
                        >
                            <Link
                                href={model.slug}
                                key={model.name}
                                className={styles['collection-link']}
                            >
                                <span
                                    className={styles['collection-svg-wrapper']}
                                >
                                    <FilePlus />
                                </span>
                                <span className={styles['collection-name']}>
                                    {model.name}
                                </span>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </DashboardWrapper>
    );
}
