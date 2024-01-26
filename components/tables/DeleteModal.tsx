'use client';

import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import styles from './Modal.module.scss';

export const DeleteModal = ({
    deleteModalOpen,
    setDeleteModalOpen,
    deleteRows,
    modelName,
}: {
    deleteModalOpen: boolean;
    setDeleteModalOpen: (deleteModalOpen: boolean) => void;
    deleteRows: () => void;
    modelName: string;
}) => {
    const cancelButtonRef = useRef(null);
    return (
        <Transition.Root show={deleteModalOpen} as={Fragment}>
            <Dialog
                as="div"
                className={styles['modal-wrapper']}
                initialFocus={cancelButtonRef}
                onClose={setDeleteModalOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter={styles['modal-enter']}
                    enterFrom={styles['modal-enter-from']}
                    enterTo={styles['modal-enter-to']}
                    leave={styles['modal-leave']}
                    leaveFrom={styles['modal-leave-from']}
                    leaveTo={styles['modal-leave-to']}
                >
                    <div className={styles['modal-backdrop']} />
                </Transition.Child>

                <div className={styles['modal-container']}>
                    <div className={styles['modal-content']}>
                        <Transition.Child
                            as={Fragment}
                            enter={styles['modal-enter']}
                            enterFrom={styles['modal-enter-from']}
                            enterTo={styles['modal-enter-to']}
                            leave={styles['modal-leave']}
                            leaveFrom={styles['modal-leave-from']}
                            leaveTo={styles['modal-leave-to']}
                        >
                            <Dialog.Panel className={styles['modal-panel']}>
                                <div>
                                    <div>
                                        <ExclamationTriangleIcon
                                            className={styles['icon']}
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div>
                                        <Dialog.Title as="h3">
                                            Delete {modelName}
                                        </Dialog.Title>
                                        <div>
                                            <p>
                                                Are you sure you want to delete
                                                the selected {modelName}s? This
                                                action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles['btn-wrapper']}>
                                    <button
                                        className="button small danger"
                                        onClick={() => {
                                            deleteRows();
                                            setDeleteModalOpen(false);
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="button small inverted"
                                        onClick={() =>
                                            setDeleteModalOpen(false)
                                        }
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
