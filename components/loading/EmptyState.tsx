import { FilePlus } from 'lucide-react';
import styles from './EmptyState.module.scss';

export const EmptyState = ({ name }: { name: string }) => {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyState__content}>
                <div className={styles.emptyState__content__icon}>
                    <FilePlus />
                </div>

                <div className={styles.emptyState__content__title}>
                    <h2>No {name}s found.</h2>
                </div>
                <div className={styles.emptyState__content__description}>
                    <p>Create a {name} to get started.</p>
                </div>
            </div>
        </div>
    );
};
