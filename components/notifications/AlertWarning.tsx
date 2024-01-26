'use client';

import toast from 'react-hot-toast';
import styles from './Alert.module.scss';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

export const AlertWarning = ({
    title,
    description,
    id,
}: {
    title: string;
    description: string;
    id: string;
}) => {
    return (
        <div className={styles['wrapper']}>
            <div>
                <ExclamationCircleIcon
                    className={classNames(styles['icon'], styles['warning'])}
                    aria-hidden="true"
                />
            </div>
            <div>
                <h3 className={styles.title}>{title || 'Success'}</h3>
                <div>
                    <p className={styles.description}>
                        {description ||
                            'Your changes have been saved successfully.'}
                    </p>
                </div>
                <div>
                    <div>
                        <button
                            onClick={() => toast.dismiss(id)}
                            className="button small inverted"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
