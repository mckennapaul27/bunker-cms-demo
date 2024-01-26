import styles from '../../styles/dashboard-general.module.scss';
import classNames from 'classnames';

export const TableEmptyState = () => {
    return (
        <div className={styles['dashboard-content-wrapper']}>
            <div
                className={classNames(styles['content-block'], styles['wide'])}
            >
                <p>No entries found</p>
            </div>
        </div>
    );
};
